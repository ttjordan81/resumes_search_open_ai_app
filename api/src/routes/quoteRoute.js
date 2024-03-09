const express = require('express');
const quoteController = require('../controllers/quote');

const router = express.Router();

/** 
 *  GET /quote/random
 *  Get a quote from db
 */
router.get('/random', quoteController.getRandomQuote);

module.exports = router;