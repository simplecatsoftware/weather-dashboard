require('dotenv').config();
const axios = require('axios');
const express = require('express');
const winston = require('winston');
const config = require('./package');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: `${config.name}-server` },
    transports: [
        new winston.transports.Console(),
    ],
});

const app = express();

if (process.env.DEBUG) {
    // If debug is enabled, disable CORS
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });
}

app.use(express.static('build'));

app.get('/api/location/:query', (req, res) => {
    const query = req.params.query;

    axios.get(`${process.env.API_ENDPOINT}/location/search`, { params: { query } })
        .then(response => {
            console.log(response.data);
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

app.listen(
    process.env.PORT,
    () => { logger.info(`listening on port ${process.env.PORT}`) }
);
