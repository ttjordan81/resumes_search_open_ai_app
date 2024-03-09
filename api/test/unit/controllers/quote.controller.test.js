const quoteController = require('../../../src/controllers/quote');
const quoteService = require('../../../src/services/quote.service');

describe('Quote Controller Test', () => {

    it('should should call QuoteService.getRandomQuote() function', async () => { 
        // Arrange
        const req = {};
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn((status) => status).mockReturnThis()
        };
        const mockNext = jest.fn();
        quoteService.getRandomQuote = jest.fn().mockImplementation(() => Promise.resolve(''));

        // Act
       await quoteController.getRandomQuote(req, res, mockNext);  

        // Assert
        expect(quoteService.getRandomQuote).toHaveBeenCalled();
    });

});