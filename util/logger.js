const winston = require('winston');
var appRoot = require('app-root-path');

const logFilePath = appRoot + "/logs/csye6225.log";

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            const logObject = {
                timestamp,
                severity: level.toUpperCase(),
                message
            };
            return JSON.stringify(logObject);
        })

    ),
    transports:[
        new winston.transports.File({filename:logFilePath})
    ]
});

module.exports = logger;