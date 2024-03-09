const Sequelize = require('sequelize');
const sequelize = require('../infrastructure/database');
const User = require('./user');

const AuditLog = sequelize.define(
    'audit_log',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: 'id'
            }
        },
        message: {
            type: Sequelize.STRING(2048),
            allowNull: false
        },
        meta: {
            type: Sequelize.JSON,
            allowNull: true
        },
        level: {
            type: Sequelize.STRING(16),
            allowNull: false
        },
        client_ip: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        requested_path: {
            type: Sequelize.STRING(255),
            allowNull: true
        }
    },
    {
        tableName: 'audit_log',
        paranoid: false
    }
);

module.exports = AuditLog;