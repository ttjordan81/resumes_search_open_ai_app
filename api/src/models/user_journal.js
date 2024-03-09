const Sequelize = require('sequelize');
const sequelize = require('../infrastructure/database');
const User = require('./user');

const UserJournal = sequelize.define(
    'user_journal',
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
        journal_entry: {
            type: Sequelize.TEXT
        }
    },
    {
        tableName: 'user_journal',
        paranoid: true
    }
);

module.exports = UserJournal;