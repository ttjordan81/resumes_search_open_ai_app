const Quote = require('../../../src/models/quote');
const quoteService = require('../../../src/services/quote.service');

describe('Quote Service Test', () => {

    it('should should call Quote.findOne() function when called', async () => {
        // Arrange
        Quote.findOne = jest.fn().mockImplementation(() => Promise.resolve(''));

        // Act
        await quoteService.getRandomQuote();  

        // Assert
        expect(Quote.findOne).toHaveBeenCalled();
    });

});