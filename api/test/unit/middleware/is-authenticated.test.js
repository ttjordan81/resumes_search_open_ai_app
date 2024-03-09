const isAuthenticated = require('../../../src/middleware/is-authenticated');
const { HttpStatusCode } = require('../../../src/common/constants');
const securityService = require('../../../src/services/security.service');
const req = require('express/lib/request');

jest.mock('express/lib/request');

describe('IsAuthenticated Middleware Test Suite', () => {

    it('should call next() with an Error object when authorization header is not provided', () => {
        // Arrange
        const res = {};
        const mockNext = jest.fn();
        req.get = jest.fn((field) => "");
        
        // Act
        isAuthenticated(req, res, mockNext);

        // Assert
        expect(req.get).toHaveBeenCalledWith('Authorization');
        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        expect(mockNext).not.toHaveBeenCalledWith();

        // Get the Error object passed to mockNext
        const passedError = mockNext.mock.calls[0][0];

        // Inspect the Error object
        expect(passedError).toBeInstanceOf(Error);
        expect(passedError.message).toMatch(/bad request/i);
        expect(passedError.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    });

    it('should verify token when one is provided and call next() with empty arg', () => {
        // Arrange
        const res = {};
        const mockNext = jest.fn();
        const authHeaderValue = 'bearer abcdefg1234567890';
        const mockReqGet = jest.fn((field) => authHeaderValue);
        req.get = mockReqGet;
        securityService.verifyToken = jest.fn().mockImplementation((token) => { return false })

        // Act
        isAuthenticated(req, res, mockNext);

        // Assert
        expect(mockReqGet).toHaveBeenCalledWith('Authorization');
        expect(securityService.verifyToken).toHaveBeenCalledWith('abcdefg1234567890');
        expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call next with unauthorized error when token verification throws exception', () => {
        // Arrange
        const res = {};
        const mockNext = jest.fn();
        const authHeaderValue = 'bearer abcdefg1234567890';
        const mockReqGet = jest.fn((field) => authHeaderValue);
        req.get = mockReqGet;
        const mockVerifyToken = securityService.verifyToken = jest.fn().mockImplementation((token) => { throw new Error('Invalid JWT token')})

        // Act
        isAuthenticated(req, res, mockNext);

        // Assert
        expect(mockReqGet).toHaveBeenCalledWith('Authorization');
        expect(securityService.verifyToken).toHaveBeenCalledWith('abcdefg1234567890');
        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        expect(mockNext).not.toHaveBeenCalledWith();

        // Get the Error object passed to mockNext
        const passedError = mockNext.mock.calls[0][0];

        // Inspect the Error object
        expect(passedError).toBeInstanceOf(Error);
        expect(passedError.statusCode).toBe(HttpStatusCode.UNAUTHORIZED);
    });

});
