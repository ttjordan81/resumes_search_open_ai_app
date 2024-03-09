const Joi = require('joi');
const { passwordsMustBeDifferent } = require('./customValidators');

const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&;,])[A-Za-z\d@.#$!%*?&;,]{8,}$/);

exports.userLoginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).required()
});

exports.userCreateSchema = Joi.object({
    first_name: Joi.string().trim().min(2).required(),
    last_name: Joi.string().trim().min(2).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().pattern(passwordRegex),
    role_id: Joi.number().integer().required(),
    phone: Joi.string().trim().required()
});

exports.userUpdateSchema = Joi.object({
    id: Joi.number().integer().required(),
    first_name: Joi.string().trim().min(2).required(),
    last_name: Joi.string().trim().min(2).required(),
    email: Joi.string().trim().email().required(),
    role_id: Joi.number().integer().required(),
    phone: Joi.string().trim().required(),
    enabled: Joi.boolean().default(true)
});

exports.userDeleteSchema = Joi.object({
    id: Joi.number().integer().required()
});

exports.userEmailVerificationSchema = Joi.object({
    emailVerificationToken: Joi.string().trim().min(8).required()
});

exports.userChangePasswordSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    oldPassword: Joi.string().trim().required().pattern(passwordRegex),
    newPassword: Joi.string().trim().required().pattern(passwordRegex).custom(passwordsMustBeDifferent)
});

exports.userForgotPasswordSchema = Joi.object({
    email: Joi.string().trim().email().required()
});

exports.userResetPasswordSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    newPassword: Joi.string().trim().required().pattern(passwordRegex),
    token: Joi.string().trim().min(8).required()
});
