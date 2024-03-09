const accountService = require('../../../src/services/account.service');
const securityService = require('../../../src/services/security.service');
const notificationService = require('../../../src/services/notification.service');
const bcrypt = require('bcrypt');
const User = require('../../../src/models/user');
const mail = require('../../../src/infrastructure/mail');

jest.mock('../../../src/models/user')
jest.mock('../../../src/infrastructure/mail');

describe('Account Services test suite', () => {

    describe('createUser() tests', () => {

        it('should throw an exception when input user argument is null', async () => {
            await expect(accountService.createUser(null))
                .rejects
                .toThrow(/invalid input argument/i);
        });

        it('should create a new user if user does not already exist', async () => {
            // Arrange
            const newUser = { first_name: 'David', last_name: 'Smith', email: 'davidsmith@localhost.com', phone: '1234567890', password: 'hello1234567'};
            jest.spyOn(bcrypt, 'genSalt');
            jest.spyOn(bcrypt, 'hash');

            // Act
            const result = await accountService.createUser(newUser);

            // Assert
            expect(User.create).toHaveBeenCalled();
            expect(User.findOne).toHaveBeenCalled();
            expect(bcrypt.genSalt).toHaveBeenCalled();
            expect(bcrypt.hash).toHaveBeenCalled();
            expect(result).toBeDefined();
            expect(result).toHaveProperty('id');
            expect(result.id).toBe(999);
        });

        it('should throw an exception when creating user that already exist', async () => {
            const existingUser = {"first_name": "Jane", "last_name": "Mockdata", "email": "jane.mockdata@localhost.com"};

            await expect(accountService.createUser(existingUser))
                .rejects
                .toThrow(/user already exists/i);
        });

    });

    describe('findUserByEmail() tests', () => { 

        it('should throw an exception when a null is provided for input email', async () => {
            const email = null;

            await expect(accountService.findUserByEmail(email))
                .rejects
                .toThrow(/invalid input argument for email/i);
        });

        it('should call sequelize model User.findOne() once when called', async () => {
            const email = 'joe@localhost.com';

            const user = await accountService.findUserByEmail(email);
            expect(User.findOne).toHaveBeenCalled();
        });

    });

    describe('updateUser() tests', () => {

        it('should throw an exception when user object is not provided in the argument', async () => {
            const user = null;
            expect(async () => await accountService.updateUser(user)).rejects.toThrow(/invalid input argument/i);
            expect(User.update).not.toHaveBeenCalled();
        });

        it('should throw an exception when user id is not provided in the input object', () => {
            const user = {};
            expect(async () => await accountService.updateUser(user)).rejects.toThrow(/invalid input argument/i);
            expect(User.update).not.toHaveBeenCalled();
        });

        it('should throw an exception when user is not found in the database', async () => {
            const user = { id: 128349 };
            expect(async () => await accountService.updateUser(user)).rejects.toThrow(/user not found/i);
            expect(User.update).not.toHaveBeenCalled();
        });

        // it('should call user.save() function when user and id are provided', async () => {
        //     const user = { id: 17 };
        //     await accountService.updateUser(user);
        //     expect(User.save).toHaveBeenCalled();
        // });
    });

    describe('deleteUser() tests', () => {

        it('should throw an exception when user id is not provided', () => {
            expect(accountService.deleteUser()).rejects.toThrow(/invalid id/i);
        });

        it('should call User.destroy when id is provided', async () => {
            const userId = 98233;
            const result = await accountService.deleteUser(userId);
            expect(result).toBe();
            expect(User.destroy).toHaveBeenCalled();
        });
    });

    describe('accountSignUp() tests', () => {  

        it('should throw an exception when user object is not provided in the argument', async () => {
            User.create.mockClear();
            expect(async () => await accountService.accountSignUp(null)).rejects.toThrow(/invalid input argument/i);
            expect(User.create).not.toHaveBeenCalled();
        })

        it('should throw an exception if a user with the same email already exists', async () => {
            User.create.mockClear();
            const user = { email: 'login_account_good@localhost.com' };
            await expect(accountService.accountSignUp(user)).rejects.toThrow(/user already exists/i);
            expect(User.create).not.toHaveBeenCalled();
        });

        it('should create the user if user does not already exist', async () => { 
            const user = { email: 'signup_account@localhost.com', first_name: 'John', last_name: 'Doe', password: 'password'};
            jest.spyOn(notificationService, 'sendEmailVerification');
            securityService.getEmailVerificationToken = jest.fn((a) => a);

            await accountService.accountSignUp(user);
            expect(User.create).toHaveBeenCalled();
            expect(securityService.getEmailVerificationToken).toHaveBeenCalled();
            expect(notificationService.sendEmailVerification).toHaveBeenCalled();
            expect(mail.send).toHaveBeenCalled();
        });

    });

    describe('verifyEmail() tests', () => {  

        it('Should call security verifyEmailToken', async () => {
            // Arrange
            const payload = {
                email: 'login_account_good@localhost.com',
                first_name: 'Jane',
                last_name: 'Doe'
            };

            // securityService.getEmailVerificationToken.mockRestore();
            // securityService.verifyEmailToken.mockRestore();

            const token = await securityService.getEmailVerificationToken(payload) ;
            //jest.spyOn(securityService,'verifyEmailToken');
            securityService.verifyEmailToken = jest.fn().mockImplementation(() => Promise.resolve(payload));

            // Act
            await accountService.verifyEmail(token);

            // Assert
            expect(securityService.verifyEmailToken).toHaveBeenCalledWith(token);
        });

    });

    describe('changePassword() tests',() => {

        it('should throw an exception when user object is not provided', () => {
            expect(accountService.changePassword()).rejects.toThrow(/invalid input/i);
        });

        it('should throw an exception when user email is not provided', () => {
            const user = { };
            expect(accountService.changePassword(user)).rejects.toThrow(/invalid input/i);
        });

        it('should throw an exception when user email is null', () => {
            const user = { email: null };
            expect(accountService.changePassword(user)).rejects.toThrow(/invalid input/i);
        });

    });

    describe('forgotPassword() tests', () => {

        it('should throw an exception when email is not provided in the request', () => {
            expect(accountService.forgotPassword()).rejects.toThrow(/invalid input/i);
        });

        it('should throw an error when it does not find a user', async () => {
            // Arrange
            const email = 'non_existing_user@localhost.com';
            // accountService.findUserByEmail = jest.spyOn(accountService, 'findUserByEmail');
            jest.spyOn(accountService, 'findUserByEmail');

            // Act
            expect(accountService.forgotPassword(email)).rejects.toThrow(/does not exist/i);

            // Assert
            expect(accountService.findUserByEmail).toHaveBeenCalledWith(email);
        });

        it('should generate password reset token when user exists in the system and send email notification', async () => {
            // Arrange
            const email = 'login_account_good@localhost.com';
            accountService.findUserByEmail = jest.spyOn(accountService, 'findUserByEmail');
            jest.spyOn(securityService, 'getPasswordResetToken');
            jest.spyOn(notificationService, 'sendPasswordResetEmail');

            // Act
            await accountService.forgotPassword(email);

             // Assert
            expect(accountService.findUserByEmail).toHaveBeenCalledWith(email);
            expect(securityService.getPasswordResetToken).toHaveBeenCalledWith({email});
            expect(notificationService.sendPasswordResetEmail).toHaveBeenCalled();
        });

    });

    describe('resetPassword() tests', () => {

        it('should throw an exception when either token and/or new password are not provided in the request', () => {
            expect(accountService.resetPassword()).rejects.toThrow(/invalid input/i);
        });

        it('should call security verifyPasswordResetToken', async () => { 
            // Arrange
            const email = 'login_account_good@localhost.com';
            const token = securityService.getPasswordResetToken({ email });
            const newPassword = 'secret_password';
            jest.spyOn(securityService, 'verifyPasswordResetToken');
            jest.spyOn(securityService, 'getHashedPassword');
            jest.spyOn(accountService, 'findUserByEmail');

            // Act
            await accountService.resetPassword(token, newPassword);

            // Assert
            expect(accountService.findUserByEmail).toHaveBeenCalledWith(email);
            expect(securityService.verifyPasswordResetToken).toHaveBeenCalledWith(token);
            expect(securityService.getHashedPassword).toHaveBeenCalledWith(newPassword);
        });

        it('should throw an exception when token provided is invalid', async  () => {
            // Arrange
            const email = 'login_account_good@localhost.com';
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
            const newPassword = 'secret_password';
            jest.spyOn(securityService, 'verifyPasswordResetToken');
            jest.spyOn(securityService, 'getHashedPassword');
            jest.spyOn(accountService, 'findUserByEmail');

            accountService.findUserByEmail.mockClear();
            securityService.verifyPasswordResetToken.mockClear();
            securityService.getHashedPassword.mockClear();

            // Act
            expect(async () => accountService.resetPassword(token, newPassword)).rejects.toThrow(/invalid signature/i);

            // Assert
            expect(securityService.verifyPasswordResetToken).toHaveBeenCalledWith(token);
            expect(accountService.findUserByEmail).not.toHaveBeenCalledWith(email);
            expect(securityService.getHashedPassword).not.toHaveBeenCalledWith(newPassword);
        });

    });
});