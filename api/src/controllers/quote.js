const { HttpStatusCode } = require('../common/constants');
const quoteService = require('../services/quote.service');

exports.getRandomQuote = async (req, res, next) => {
    try {
        const randomQuote = await quoteService.getRandomQuote();
        return res.status(HttpStatusCode.OK).send(randomQuote);
    } catch (err) {
        const error = new Error(err.message);
        error.statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
        next(error);
    }
}