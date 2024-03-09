const Joi = require('joi');
const { validateData } = require('../../../src/middleware/data-validator');

const simpleLoginSchema = Joi.object({
    loginId: Joi.string()
                .min(3)
                .required(),
    password: Joi.string()
                .min(8)
                .required()
});


describe('Data-Validator Middleware Test Suite', () => {

    it('should return an error when schema is not provided', () => {
        const req = {
            method: 'POST',
            body: {}
        };
        const next = jest.fn();

        validateData()(req, {}, next);

        const arg = next.mock.calls[0][0];
        expect(next).toHaveBeenCalled();
        expect(arg.constructor.name).toBe('Error');   // Checks next() was passed with the Error Object
        expect(arg.message).toMatch(/validation schema not/i);
    });

    it('should be able validate and pass a simple login/password schema', () => {
        const req = {
            method: 'POST',
            body: {
                loginId: "joe@localhot.com",
                password: "2o38u742"
            }
        }
        const next = jest.fn();

        validateData(simpleLoginSchema)(req, {}, next);
        const arg = next.mock.calls[0][0];

        expect(next).toHaveBeenCalled();
        expect(arg).toBeUndefined();
    });

    it('should return error when required loginId is not provided', () => {
        const req = {
            method: 'POST',
            body: {
                loginId: "",
                password: "2o38u742"
            }
        }
        const next = jest.fn();

        validateData(simpleLoginSchema)(req, {}, next);
        const arg = next.mock.calls[0][0];

        expect(next).toHaveBeenCalled();
        expect(arg).toBeDefined();
        expect(arg.constructor.name).toBe('Error');   // Checks next() was passed with the Error Object
        expect(arg.message).toMatch(/loginId" is not allowed/i);
    });

    it('should return error when loginId length less than 3 chars', () => {
        const req = {
            method: 'POST',
            body: {
                loginId: "yo",
                password: "2o38u742"
            }
        }
        const next = jest.fn();

        validateData(simpleLoginSchema)(req, {}, next);
        const arg = next.mock.calls[0][0];

        expect(next).toHaveBeenCalled();
        expect(arg).toBeDefined();
        expect(arg.constructor.name).toBe('Error');   // Checks next() was passed with the Error Object
        expect(arg.message).toMatch(/loginId" length must be/i);
    });

    it('should return error when password field is not provided', () => {
        const req = {
            method: 'POST',
            body: {
                loginId: "Darrel"
            }
        }
        const next = jest.fn();

        validateData(simpleLoginSchema)(req, {}, next);
        const arg = next.mock.calls[0][0];

        expect(next).toHaveBeenCalled();
        expect(arg).toBeDefined();
        expect(arg.constructor.name).toBe('Error');   // Checks next() was passed with the Error Object
        expect(arg.message).toMatch(/"password" is required/i);
    });

    it('should return error when both login and password fields are not provided', () => {
        const req = {
            method: 'POST',
            body: {
            }
        }
        const next = jest.fn();

        validateData(simpleLoginSchema)(req, {}, next);
        const arg = next.mock.calls[0][0];

        expect(next).toHaveBeenCalled();
        expect(arg).toBeDefined();
        expect(arg.constructor.name).toBe('Error');   // Checks next() was passed with the Error Object
    });
});