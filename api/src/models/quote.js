const Sequelize = require('sequelize');
const sequelize = require('../infrastructure/database');

const Quote = sequelize.define(
    'quote',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        quote_entry: {
            type: Sequelize.STRING(1024)
        },
        author: {
            type: Sequelize.STRING(40)
        }
    },
    {
        tableName: 'quote',
        paranoid: false
    }
);

module.exports = Quote;