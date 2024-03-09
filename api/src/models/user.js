const Sequelize = require('sequelize');
const sequelize = require('../infrastructure/database');

const User = sequelize.define(
    'user',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        first_name: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        email_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0
        },
        phone: {
            type: Sequelize.STRING(20)
        },
        password: {
            type: Sequelize.STRING(100)
        },
        last_password_update: {
            type: Sequelize.DATE
        },
        force_password_update: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            defaultValue: 1
        },
        failed_login_count: {
            type: Sequelize.TINYINT,
            defaultValue: 0
        },
        role_id: {
            type: Sequelize.TINYINT
        },
        last_signed_in: {
            type: Sequelize.DATE
        },
        two_factor_enabled: {
            type: Sequelize.BOOLEAN
        },
        two_factor_verified: {
            type: Sequelize.BOOLEAN
        },
        two_factor_secret: {
            type: Sequelize.STRING(50)
        }
    },
    {
        tableName: 'user',
        paranoid: true
    }
);

module.exports = User;