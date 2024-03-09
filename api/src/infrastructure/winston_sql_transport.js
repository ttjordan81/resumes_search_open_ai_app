const util = require('util');
const Transport = require('winston-transport');
const AuditLog = require('../models/audit_log');

/**
 * This module implements the custom transport for Winston logging
 * to AHP SQL Database
 */
module.exports = class WinstonSQLTransport extends Transport {
    constructor(options = {}) {
        super(options);
        this.level = options.level || 'info';
        this.name = options.name || 'WinstonSQLTransport';
    }

    async log(info, callback) {
        const { level, message, client_ip, requested_path, user_id, timestamp, ...meta } = info;

        if (!callback) {
            callback = () => {};
        }

        try {
            // util.inspect() below handles circular references
            let json = '';

            try {
                json = util.inspect(meta);
            } catch (err) {
                console.log(err);
            }

            await AuditLog.create({
                level: level,
                message: message,
                meta: json,
                client_ip: client_ip,
                requested_path: requested_path,
                user_id: user_id,
                createdAt: timestamp
            });
            this.emit('logged');
            callback();
        } catch (err) {
            console.log(err);
            callback(err);
        }
    }
};
