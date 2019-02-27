require('dotenv').config();
const axios = require('axios');
const express = require('express');
const winston = require('winston');
const config = require('./package');
const {promisify} = require('util');
const redis = require("redis");
const crypto = require('crypto');

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

const data = {};

const cacheClient = {
    get: client.connected ?
        promisify(client.get).bind(client) :
        hash => (new Promise((resolve, reject) => {
            try {
                resolve(JSON.parse(data[hash]));
            } catch (e) {
                resolve();
            }
        })),
    set: client.connected ?
        promisify(client.set).bind(client) :
        (hash, value) => (new Promise((resolve, reject) => {
            try {
                data[hash] = JSON.stringify(value);
                resolve();
            } catch (e) {
                reject();
            }
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
    const hash = crypto.createHash('sha1').update(JSON.stringify([url, params, (new Date()).toJSON().slice(0, 10)])).digest("hex");

    return cacheClient.get(hash)
        .then(result => {
            if (result) {
                logger.info(`Cache hit`, {hash, result});
                try {
                    return JSON.parse(result);
                } catch (e) {}
            }

            return axios.get(`${process.env.API_ENDPOINT}/location/search`, {params})
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
            logger.error(`Could not retrieve data from cache ${error.toString()}`)
            throw error;
        });
};

app.get('/api/location/:query', (req, res) => {
    const query = req.params.query;

    axios.get(`${process.env.API_ENDPOINT}/location/search`, {params: {query}})
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            res.send(error.response.data);
        });
});

app.get('/api/weather/:woeid', (req, res) => {
    axios.get(`${process.env.API_ENDPOINT}/location/${req.params.woeid}`)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            res.send(error.response.data);
        });
});

app.use(express.static('build'));

app.listen(
    process.env.PORT,
    () => {
        logger.info(`listening on port ${process.env.PORT}, debug mode is ${process.env.DEBUG ? 'on' : 'off'}`);
    }
);
