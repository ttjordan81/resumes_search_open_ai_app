const isAdminRole = require('../../../src/middleware/is-admin-role');
const User = require('../../../src/models/user');
const { UserRole } = require('../../../src/common/constants');

describe('isAdminRole Middleware Test Suite', () => {

    it('should return unauthorized error if context object does not exist in req', () => {
        // Arrange
        const req = {};
        const mockNext = jest.fn();

        // Acct
        isAdminRole(req, {}, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        expect(mockNext).not.toHaveBeenCalledWith();
    });

    it('should return unauthorized error if role field does not exist in context', () => {
        // Arrange
        const req = { context: {} };
        const mockNext = jest.fn();

        // Acct
        isAdminRole(req, {}, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        expect(mockNext).not.toHaveBeenCalledWith();
    });

    it('should call next() with no arg when user role is Admin', () => {
        // Arrange
        const req = { context: { role: UserRole.ADMIN} };
        const mockNext = jest.fn();

        // Acct
        isAdminRole(req, {}, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call next() with error arg when user role is not Admin', () => {
        // Arrange
        const req = { context: { role: UserRole.USER } };
        const mockNext = jest.fn();

        // Acct
        isAdminRole(req, {}, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalledWith();
        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
});