const Sequelize = require('sequelize');
const sequelize = require('../infrastructure/database');
const User = require('./user');

const WellnessToolbox = sequelize.define(
    'wellness_toolbox',
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
        activity: {
            type: Sequelize.STRING(300),
            allowNull: false
        },
        image_name: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        points: {
            type: Sequelize.TINYINT,
            defaultValue: 0
        },
        sort_weight: {
            type: Sequelize.SMALLINT,
            defaultValue: 0
        }
    },
    {
        tableName: 'wellness_toolbox',
        paranoid: true
    }
);

module.exports = WellnessToolbox;