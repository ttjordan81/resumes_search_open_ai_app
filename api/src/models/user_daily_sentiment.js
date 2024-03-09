const Sequelize = require('sequelize');
const sequelize = require('../infrastructure/database');
const User = require('./user');

const UserDailySentiment = sequelize.define(
    'user_daily_sentiment',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        scale: {
            type: Sequelize.TINYINT,
            defaultValue: 0
        }
    },
    {
        tableName: 'user_daily_sentiment',
        paranoid: true
    }
);

module.exports = UserDailySentiment;