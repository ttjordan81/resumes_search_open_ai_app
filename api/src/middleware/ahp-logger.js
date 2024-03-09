const winston = require('winston');
const { combine, timestamp, json, errors } = winston.format;
const SQLTransport = require('../infrastructure/winston_sql_transport');

/**
 * Wrapper middleware for custom Winston Logger.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = (req, res, next) => {
    global.log = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: combine(timestamp(), errors({ stack: true }), json()),

        defaultMeta: {
            requested_path: req.originalUrl,
            client_ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '',
            email: req.context?.email,
            user_id: req.context?.user_id
        },

        transports: [new winston.transports.Console() , new SQLTransport()]
    });

    next();
};
