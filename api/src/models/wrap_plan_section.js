const Sequelize = require('sequelize');
const sequelize = require('../infrastructure/database');
const WrapPlan = require('./wrap_plan');

const WrapPlanSection = sequelize.define(
    'wrap_plan_section',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        wrap_plan_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            refereces: {
                model: WrapPlan,
                key: 'id'
            }
        },
        section_text: {
            type: Sequelize.STRING(1024),
            allowNull: false
        },
        isActionable: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 1
        },
        sort_weight: {
            type: Sequelize.SMALLINT,
            defaultValue: 0
        }
    },
    {
        tableName: 'wrap_plan_section',
        paranoid: true
    }
);

module.exports = WrapPlanSection;