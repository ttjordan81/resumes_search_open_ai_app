const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    logging: process.env.DB_SQL_LOGGING === 'true' ? (...msg) => msg.forEach((m) => console.log(m)) : false,
    logQueryParameters: process.env.DB_SQL_LOGGING === 'true'
});

module.exports = sequelize;
