const Sequelize = require('sequelize');
const sequelize = require('../infrastructure/database');
const Quote = require('../models/quote');

/**
 * Retrieve a random quote from the database
 * @returns 
 */
exports.getRandomQuote = async () => {
    const randomQuote = await Quote.findOne({
        where: {
            id: {
                [Sequelize.Op.gte]: sequelize.literal(`(SELECT FLOOR(MAX(id) * RAND()) FROM quote)`),
            },
        },
        limit: 1 
    });

    return randomQuote;
}