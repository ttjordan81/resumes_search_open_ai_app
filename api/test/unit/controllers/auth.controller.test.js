const jwt = require('jsonwebtoken');
const authController  = require('../../../src/controllers/auth');
const securityService = require('../../../src/services/security.service');
const accountService = require('../../../src/services/account.service');
const { HttpStatusCode } = require('../../../src/common/constants');

describe('AuthController Test Suite', () => {

    describe('login() tests', () => {

        it('AuthController should be defined', () => {
            expect(authController).toBeDefined();
        });

        it('should allow user to login when a valid login id and password are provided', async () => {
            // Arrange
            const email = '';
            const password = '';
            const req = { 
                headers: [],
                body: {
                    email: "login_account_good@localhost.com",
                    password: "secret"
                }
            };

            securityService.authenticateUser = jest.fn((email, password) => { return true});
            const mockSend = jest.fn().mockReturnThis();
            const mockStatus = jest.fn((status) => status).mockReturnThis();
            const mockNext = jest.fn();
            const res = { send: mockSend, status: mockStatus };

            // Act
            const loginResult = await authController.login(req, res, mockNext);

            // Assert
            expect(securityService.authenticateUser).toHaveBeenCalled();
            expect(securityService.authenticateUser).toHaveBeenCalledWith('login_account_good@localhost.com','secret');
            expect(mockNext).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalled();
            expect(mockStatus.mock.calls.map(([status]) => status)[0]).toEqual(HttpStatusCode.OK);
            expect(mockSend).toHaveBeenCalled();
        });

        it('should call next with the error when authenticaiton failed', async () => {
            // Arrange
            const email = '';
            const password = '';
            const req = { 
                headers: [],
                body: {
                    email: "test@localhost.com",
                    password: "1234567"
                }
            };

            securityService.authenticateUser = jest.fn((email, password) => { 
                const err =  new Error("Some mock exception")
                err.status = HttpStatusCode.BAD_REQUEST;
                throw err;
            });

            const mockSend = jest.fn().mockReturnThis();
            const mockStatus = jest.fn((status) => status).mockReturnThis();
            const mockNext = jest.fn();

            const res = { 
                send: mockSend,
                status: mockStatus
            };

            // Act
            const loginResult = await authController.login(req, res, mockNext);

            // Assert
            expect(securityService.authenticateUser).toHaveBeenCalled();
            expect(securityService.authenticateUser).toHaveBeenCalledWith('test@localhost.com','1234567');

            expect(mockNext).toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
            expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({message: 'Some mock exception'}));
            expect(mockSend).not.toHaveBeenCalled();
        });
    });

    describe('verifyEmail() tests', () => {

        it('Calls securityService.verifyEmailToken with invalid token should call next(Error)', async () => {
            // Arrange
            const req = { params: { 
                emailVerificationToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'}};
            const res = {}
            const next = jest.fn().mockImplementation((err) => {err});

            const err = new Error('some mock exception');
            err.statusCode = HttpStatusCode.BAD_REQUEST;
            accountService.verifyEmail = jest.fn().mockRejectedValue(err);

            // Act
            const result = await authController.verifyEmail(req, res, next);

            // Assert
            expect(accountService.verifyEmail).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        it('Calls securityService.verifyEmailToken with valid token should respond with accepted status', async () => {
            // Arrange
            const payload = {
                email: 'test@localhost.com',
                first_name: 'Jane',
                last_name: 'Doe'
            };

            const token = securityService.getEmailVerificationToken(payload) ;
            const req = { params: { emailVerificationToken: token }};

            const mockRender = jest.fn().mockReturnThis();
            const mockStatus = jest.fn((status) => status).mockReturnThis();
            const mockNext = jest.fn();
            accountService.verifyEmail = jest.fn();

            const res = { 
                render: mockRender,
                status: mockStatus
            };

            // Act
            const result = await authController.verifyEmail(req, res, mockNext);

            // Assert
            expect(accountService.verifyEmail).toHaveBeenCalled();
            expect(mockStatus.mock.calls.map(([status]) => status)[0]).toEqual(HttpStatusCode.ACCEPTED);
            expect(mockRender).toHaveBeenCalled();
        })
    });

    describe('accountSignUp() tests', () => {

        it('should call accountService.accountSignUp()', async () => {
            // Arrange
            const req = { };
            const res = { };
            const mockNext = jest.fn();
            accountService.accountSignUp = jest.fn().mockImplementation(async () => {});

            // Act
            authController.accountSignUp(req, res, mockNext);

            // Assert
            expect(accountService.accountSignUp).toHaveBeenCalled();
        });

        it('should return status of 200 when signup is successful', async () => {
            // Arrange
            const req = { body: { user: 'test@localhost.com'} };
            const mockSend = jest.fn().mockReturnThis();
            const mockStatus = jest.fn((status) => status).mockReturnThis();
            const mockNext = jest.fn();
            const res = { 
                send: mockSend,
                status: mockStatus
            };
            accountService.accountSignUp = jest.fn().mockImplementation(async () => { return true});

            // Act
            await authController.accountSignUp(req, res, mockNext);

            // Assert
            expect(accountService.accountSignUp).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(HttpStatusCode.CREATED);
            expect(mockSend).toHaveBeenCalled();
        });

        it('should return with error status when signup is unsuccessful', async () => {
            // Arrange
            const req = { };
            const mockSend = jest.fn().mockReturnThis();
            const mockStatus = jest.fn((status) => status).mockReturnThis();
            const mockNext = jest.fn();
            const res = { 
                send: mockSend,
                status: mockStatus
            };
            accountService.accountSignUp = jest.fn().mockRejectedValue(new Error('Some mock exception'));

            // Act
            await authController.accountSignUp(req, res, mockNext);

            // Assert
            expect(accountService.accountSignUp).toHaveBeenCalled();
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('forgotPassword() tests', () => {

        it('should call accountService.forgotPassword()', async () => {
            // Arrange
            accountService.forgotPassword = jest.fn();
            const req = { validatedData: { email: 'test@localhost.com'} };
            const mockSend = jest.fn().mockReturnThis();
            const mockStatus = jest.fn((status) => status).mockReturnThis();
            const res = { 
                send: mockSend,
                status: mockStatus
            };

            // Act
            await authController.forgotPassword(req, res);

            // Assert
            expect(accountService.forgotPassword).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
        });

    });

    describe('resetPassword() tests', () => {

        it('should call accountService.resetPassword()', async () => {
            // Arrange
            const email = 'test@localhost.com';
            const token = securityService.getEmailVerificationToken({ email });
            const req = { validatedData: { email, newPassword: 'secret', token} };
            accountService.resetPassword = jest.fn();
            const mockSend = jest.fn().mockReturnThis();
            const mockStatus = jest.fn((status) => status).mockReturnThis();
            const mockNext = jest.fn();
            const res = { 
                send: mockSend,
                status: mockStatus
            };

            // Act
            await authController.resetPassword(req, res, mockNext);

            // Assert
            expect(accountService.resetPassword).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(HttpStatusCode.ACCEPTED);
        });
    });

});