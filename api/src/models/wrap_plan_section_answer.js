const Sequelize = require('sequelize');
const sequelize = require('../infrastructure/database');
const WrapPlanSection = require('./wrap_plan_section');
const WellnessToolbox = require('./wellness_toolbox');

const WrapPlanSectionAnswer = sequelize.define(
    'wrap_plan_section_answer',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        wrap_plan_section_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            refereces: {
                model: WrapPlanSection,
                key: 'id'
            }
        },
        activity_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            refereces: {
                model: WellnessToolbox,
                key: 'id'
            }
        },
        response_entry: {
            type: Sequelize.STRING(1024),
            allowNull: true
        },
        completed: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: 0
        },
        notify_daily: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: 0
        },
        notify_time: {
            type: Sequelize.TIME,
            allowNull: true,
            defaultValue: null
        },
        sort_weight: {
            type: Sequelize.SMALLINT,
            defaultValue: 0
        }
    },
    {
        tableName: 'wrap_plan_section_answer',
        paranoid: true
    }
);

module.exports = WrapPlanSectionAnswer;