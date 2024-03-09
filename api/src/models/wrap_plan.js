const Sequelize = require('sequelize');
const sequelize = require('../infrastructure/database');

const WrapPlan = sequelize.define(
    'wrap_plan',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: false,
            allowNull: false,
            primaryKey: true
        },
        plan_name: {
            type: Sequelize.STRING(200)
        }
    },
    {
        tableName: 'wrap_plan',
        paranoid: true
    }
);

module.exports = WrapPlan;