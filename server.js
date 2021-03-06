const axios = require('axios');
const config = require('./package');
const crypto = require('crypto');
const express = require('express');
const redis = require("redis");
const winston = require('winston');
const {get, set} = require('lodash');
const {promisify} = require('util');

require('dotenv').config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: `${config.name}-server`},
    transports: [
        new winston.transports.Console(),
    ],
});

const client = redis.createClient({
    url: process.env.REDIS_URL,
});

client.on("error", function (err) {
    logger.error(`Redis connection failed ${err.toString()}`);
    client.quit();
});

const memoryCache = {};

const cacheClient = {
    get: client.connected ?
        promisify(client.get).bind(client) :
        hash => (new Promise((resolve) => {
            logger.debug(`using memory cache`, {hash});
            try {
                resolve(JSON.parse(get(memoryCache, hash)));
            } catch (e) {
                resolve(get(memoryCache, hash));
            }
        })),

    set: client.connected ?
        promisify(client.set).bind(client) :
        (hash, value) => (new Promise(resolve => {
            logger.debug(`using memory cache`, {hash, value});
            try {
                set(memoryCache, hash, JSON.stringify(value));
            } catch (e) {
                set(memoryCache, hash, value);
            }

            resolve(value);
        })),
};

const app = express();

if (process.env.DEBUG) {
    // If debug is enabled, disable CORS
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });
}

app.use((req, res, next) => {
    res.on('close', () => {
        logger.info('response finished', {
            request: {
                method: req.method,
                url: req.url,
                query: req.query,
                params: req.params,
                data: req.data,
            },
            response: {
                status: {
                    code: res.statusCode,
                    message: res.statusMessage,
                },
            },
        });
    });

    next();
});

const request = (url, params) => {
    const hash = crypto.createHash('sha1')
        .update(JSON.stringify([
            url,
            params,
            (new Date()).toJSON().slice(0, 10)
        ]))
        .digest("hex");

    return cacheClient.get(hash)
        .then(result => {
            if (result) {
                logger.info(`Cache hit`, {hash, result});
                try {
                    return JSON.parse(result);
                } catch (e) {
                    return result;
                }
            }

            logger.info(`Requesting from api`, {hash, url, params});
            return axios.get(url, {params})
                .then(response => response.data)
                .then(data => {
                    return cacheClient
                        .set(hash, data)
                        .then(() => {
                            logger.info(`Cache set`, {hash, data});
                            return data;
                        })
                })
                .catch(error => {
                    logger.error(`Could not retrieve data from api ${error.toString()}`);
                    throw error;
                })
        })
        .catch(error => {
            logger.error(`Could not retrieve data from cache ${error.toString()}`);
            throw error;
        });
};

app.get('/api/location/:query', (req, res) => {
    const query = req.params.query;

    request(`${process.env.API_ENDPOINT}/location/search`, {query})
        .then(data => {
            res.send(data);
        })
        .catch(error => {
            res.status(error.response.statusCode).send(error.response.data);
        });
});

app.get('/api/weather/:woeid/:year?/:month?/:day?', (req, res) => {
    let url = `${process.env.API_ENDPOINT}/location/${req.params.woeid}`;

    if (req.params.year && req.params.month && req.params.day) {
        url += `/${req.params.year}/${req.params.month}/${req.params.day}`;
    }

    request(url)
        .then(data => {
            res.send(data);
        })
        .catch(error => {
            res.status(error.response.status).send(error.response.data);
        });
});

app.use(express.static('build'));

app.listen(
    process.env.PORT,
    () => {
        logger.info(`listening on port ${process.env.PORT}, debug mode is ${process.env.DEBUG ? 'on' : 'off'}`);
    }
);
