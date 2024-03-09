const Sequelize = require('sequelize');
const sequelize = require('../infrastructure/database');
const User = require('./user');

const UserQuote = sequelize.define(
    'user_quote',
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
        quote_entry: {
            type: Sequelize.STRING(1024)
        },
        author: {
            type: Sequelize.STRING(40)
        },
        sort_weight: {
            type: Sequelize.SMALLINT,
            defaultValue: 0
        }
    },
    {
        tableName: 'user_quote',
        paranoid: false
    }
);

module.exports = UserQuote;