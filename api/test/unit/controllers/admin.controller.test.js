const adminController  = require('../../../src/controllers/admin');
const accountService = require('../../../src/services/account.service');
const { HttpStatusCode } = require('../../../src/common/constants');

describe('Account Controller Test Suite', () => {

    describe('createUser() tests', () => {

        it('AccontController should be defined', () => {
            expect(adminController).toBeDefined();
        });

        it('should call next() with an error when an invalid user object is provided', async () => {
            // Arrange
            const req = { 
                headers: [],
                body: { }
            };

            const spyServiceCreateUser = jest.spyOn(accountService, 'createUser');
            const mockSend = jest.fn().mockReturnThis();
            const mockStatus = jest.fn((status) => status).mockReturnThis();
            const mockNext = jest.fn((err) => err);

            const res = { 
                send: mockSend,
                status: mockStatus
            };

            // Act
            const result =  await adminController.createUser(req, res, mockNext);

            // Assert
            expect(spyServiceCreateUser).toHaveBeenCalled();
            expect(log.error).toHaveBeenCalled();
            expect(mockStatus).not.toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalled();
            expect(mockSend).not.toHaveBeenCalled();
        });

        it('should call account.createUser() function without error with a valid user input', async () => {
            // Arrange
            const req = { 
                headers: [],
                body: {
                    email: "test@localhost.com",
                    password: "1234567"
                }
            };

            accountService.createUser = jest.fn((usr) => {});
            const mockSend = jest.fn().mockReturnThis();
            const mockStatus = jest.fn((status) => status).mockReturnThis();
            const mockNext = jest.fn();

            const res = { 
                send: mockSend,
                status: mockStatus
            };

            // Act
            const result =  await adminController.createUser(req, res, mockNext);

            // Assert
            expect(accountService.createUser).toHaveBeenCalled();
            expect(log.info).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalled();
            expect(mockStatus.mock.calls.map(([status]) => status)[0]).toEqual(HttpStatusCode.CREATED);
            expect(mockSend).toHaveBeenCalled();
        });
    
    });

    describe('updateUser() tests', () => {

        it('should call accountService.updateUser() method with user model', async () => {
            // Arrange
            const req = { 
                headers: [],
                body: {
                    email: "test@localhost.com",
                    password: "1234567"
                }
            };

            const mockSend = jest.fn().mockReturnThis();
            const mockStatus = jest.fn((status) => status).mockReturnThis();

            const res = { 
                send: mockSend,
                status: mockStatus
            };
            accountService.updateUser = jest.fn((usr) => {});

            // Act
            await adminController.updateUser(req, res);

            // Assert
            expect(accountService.updateUser).toHaveBeenCalled();
            expect(mockStatus.mock.calls.map(([status]) => status)[0]).toEqual(HttpStatusCode.ACCEPTED);
            expect(mockSend).toHaveBeenCalled();
        });

        it('should call accountService.updateUser() and handle exception by calling next(err)', async () => {
            // Arrange
            const req = { 
                headers: [],
                body: {
                    email: "test@localhost.com",
                    password: "1234567"
                }
            };

            const mockSend = jest.fn().mockReturnThis();
            const mockStatus = jest.fn((status) => status).mockReturnThis();
            const mockNext = jest.fn();

            const res = { 
                send: mockSend,
                status: mockStatus
            };
            const err = new Error('some mock exception');
            err.statusCode = HttpStatusCode.BAD_REQUEST;
            accountService.updateUser = jest.fn().mockRejectedValue(err);

            // Act
            await adminController.updateUser(req, res, mockNext);

            // Assert
            expect(accountService.updateUser).toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('deleteUser() tests', () => {

        it('shoud call accountService.deleteUser()', async () => {
            // Arrange
            const req = { 
                body: { id: 1234567 }
            };

            const mockSend = jest.fn().mockReturnThis();
            const mockStatus = jest.fn((status) => status).mockReturnThis();
            const mockNext = jest.fn();
            accountService.deleteUser = jest.fn((id) => id);

            const res = { 
                send: mockSend,
                status: mockStatus
            };

            // Act
            await adminController.deleteUser(req, res, mockNext);

            // Assert
            expect(accountService.deleteUser).toHaveBeenCalled();
            expect(mockStatus.mock.calls.map(([status]) => status)[0]).toEqual(HttpStatusCode.ACCEPTED);
            expect(mockSend).toHaveBeenCalled();
        });

        it('should call accountService.deleteUser() and handle exception by calling next(err)', async () => {
            // Arrange
            const req = { 
                body: { id: 1234567 }
            };

            const mockSend = jest.fn().mockReturnThis();
            const mockStatus = jest.fn((status) => status).mockReturnThis();
            const mockNext = jest.fn();

            const res = { 
                send: mockSend,
                status: mockStatus
            };
            const err = new Error('some mock exception');
            err.statusCode = HttpStatusCode.BAD_REQUEST;
            accountService.deleteUser = jest.fn().mockRejectedValue(err);

            // Act
            await adminController.deleteUser(req, res, mockNext);

            // Assert
            expect(accountService.deleteUser).toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });

    });

});