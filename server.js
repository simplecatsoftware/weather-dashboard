require('dotenv').config();
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

app.listen(
    process.env.PORT,
    () => { logger.info(`listening on port ${process.env.PORT}`) }
);
