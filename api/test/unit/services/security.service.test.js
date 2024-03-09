const SecurityService = require('../../../src/services/security.service');
const bcrypt = require('bcrypt');
const User = require('../../../src/models/user');

jest.mock('../../../src/models/user');
jest.mock('bcrypt');

describe('Security Services test suite', () => {

    describe('authenticateUser()', () => {
        
        describe('Basic input validations', () => {
            it('should throw exception when login and password are empty', () => {
                expect(SecurityService.authenticateUser('', '')).rejects.toThrow(/invalid input arguments/i);
            });

            it('should throw exception when login and password are null', () => {
                expect(SecurityService.authenticateUser(null, null)).rejects.toThrow(/invalid input arguments/i);
            });

            it('should throw exception when login and password are undefined', () => {
                expect(SecurityService.authenticateUser(undefined, undefined)).rejects.toThrow(/invalid input arguments/i);
            });

            it('should throw exception when login and password have empty strings', () => {
                expect(SecurityService.authenticateUser(' ', ' ')).rejects.toThrow(/invalid input arguments/i);
            });

            it('should throw exception when login is not provided', () => {
                expect(SecurityService.authenticateUser('', 'l2k342987')).rejects.toThrow(/invalid input arguments/i);
            });

            it('should throw exception when password is not provided', () => {
                expect(SecurityService.authenticateUser('test@localhost.com', '')).rejects.toThrow(/invalid input arguments/i);
            });
        });

        describe('Record validations', () => {
            beforeAll(() => { 
                bcrypt.compare = jest.fn().mockImplementation((password, hash) => { 
                    return password === hash;
                });
            });

            it('should throw exception when user not found', () => {
                expect(SecurityService.authenticateUser('user1', '1234lk3987')).rejects.toThrow(/user not found/i);
            });

            it('should throw an exception when user login is disabled', () => {
                expect(SecurityService.authenticateUser('login_account_disabled@localhost.com', 'secret')).rejects.toThrow(/locked/i);
            });

            it('should throw an exception when user login enabled flag is undefined', () => {
                expect(SecurityService.authenticateUser('login_account_undefined@localhost.com', 'secret')).rejects.toThrow(/locked/i);
            });
        });

        describe('Password validations', () => {
            beforeAll(() => { 
                bcrypt.compare = jest.fn().mockImplementation((password, hash) => { 
                    return password === hash;
                });
            });

            afterEach(() => {
                jest.clearAllMocks();
            });

            it('should return response payload when provided with a valid account and password', async () => {
                await expect(SecurityService.authenticateUser('login_account_good@localhost.com', 'secret')).resolves.toEqual(
                    expect.objectContaining({
                        id: expect.any(Number),
                        email: expect.any(String),
                        first_name: expect.any(String),
                        last_name: expect.any(String),
                        role_id: expect.any(Number)
                    })
                );
                expect(bcrypt.compare).toHaveBeenCalled()
            });

            it('should not contain password field in the response payload when provided with a valid account and password', async () => {
                User.reset();
                const result = await SecurityService.authenticateUser('login_account_good@localhost.com', 'secret');
                expect(result.password).toBeUndefined();
            });

            it('should throw exception when provided with a valid account and bad password', async () => {
                await expect(SecurityService.authenticateUser('login_account_good@localhost.com', 'badpassword')).rejects.toThrow(/authentication failed/i);
                expect(bcrypt.compare).toHaveBeenCalled()
            });

            it('should throw exception when X number of login attempts happened and account got locked', async () => {
                const MAX_LOGIN_ATTEMPTS = 5;
                User.reset();

                for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
                    await expect(SecurityService.authenticateUser('login_account_good@localhost.com', 'badpassword')).rejects.toThrow(/authentication failed/i);
                }
                await expect(SecurityService.authenticateUser('login_account_good@localhost.com', 'secret')).rejects.toThrow(/locked/i);
            });

            it('should login when user succesfully authenticates after failed (MAX_LOGIN_ATTEMPTS - 1) attemps', async () => {
                const MAX_LOGIN_ATTEMPTS = 5;
                User.reset();

                for (let i = 0; i < MAX_LOGIN_ATTEMPTS - 1; i++) {
                    await expect(SecurityService.authenticateUser('login_account_good@localhost.com', 'badpassword')).rejects.toThrow(/authentication failed/i);
                }

                await expect(SecurityService.authenticateUser('login_account_good@localhost.com', 'secret')).resolves.toEqual(
                    expect.objectContaining({
                        id: expect.any(Number),
                        email: expect.any(String),
                        first_name: expect.any(String),
                        last_name: expect.any(String),
                        role_id: expect.any(Number)
                    })
                );
            });

            it('it should reset failed_login_count to zero when user login successfully before the limit', async () => {
                const MAX_LOGIN_ATTEMPTS = 5;
                User.reset();
                let user = null;

                for (let i = 0; i < MAX_LOGIN_ATTEMPTS - 2; i++) {
                    await expect(SecurityService.authenticateUser('login_account_good@localhost.com', 'badpassword')).rejects.toThrow(/authentication failed/i);
                    user = await User.findOne({where: { email: 'login_account_good@localhost.com'}});
                }

                await expect(SecurityService.authenticateUser('login_account_good@localhost.com', 'secret')).resolves.toEqual(
                    expect.objectContaining({
                        id: expect.any(Number),
                        email: expect.any(String),
                        first_name: expect.any(String),
                        last_name: expect.any(String),
                        role_id: expect.any(Number)
                    })
                );
                expect(user.failed_login_count).toBe(0);
            });

        });

    });
});