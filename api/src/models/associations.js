const User = require('./user');
const AuditLog = require('./audit_log');
const WellnessToolbox = require('./wellness_toolbox');
const UserDailySentiment = require('./user_daily_sentiment');
const UserJournal = require('./user_journal');
const UserQuote = require('./user_quote');
const WrapPlan = require('./wrap_plan');
const WrapPlanSection = require('./wrap_plan_section');
const WrapPlanSectionAnswer = require('./wrap_plan_section_answer');
const Quote = require('./quote');

User.hasMany(AuditLog, { foreignKey: 'user_id' });
User.hasMany(WellnessToolbox, { foreignKey: 'user_id' });
User.hasMany(UserDailySentiment, { foreignKey: 'user_id' });
User.hasMany(UserJournal, { foreignKey: 'user_id' });
User.hasMany(UserQuote, { foreignKey: 'user_id' });

AuditLog.belongsTo(User, { foreignKey: 'user_id' });
UserDailySentiment.belongsTo(User, { foreignKey: 'user_id' });
UserJournal.belongsTo(User, { foreignKey: 'user_id' });
UserQuote.belongsTo(User, { foreignKey: 'user_id' });

WellnessToolbox.belongsTo(User, { foreignKey: 'user_id' });
WellnessToolbox.hasMany(WrapPlanSectionAnswer, { foreignKey: 'activity_id'});

WrapPlan.hasMany(WrapPlanSection, { foreignKey: 'wrap_plan_id' });

WrapPlanSection.belongsTo(WrapPlan, { foreignKey: 'wrap_plan_id' })
WrapPlanSection.hasMany(WrapPlanSectionAnswer, { foreignKey: 'wrap_plan_section_id' })

WrapPlanSectionAnswer.belongsTo(WrapPlanSection, { foreignKey: 'wrap_plan_section_id'});
WrapPlanSectionAnswer.belongsTo(WellnessToolbox, { foreignKey: 'activity_id'});