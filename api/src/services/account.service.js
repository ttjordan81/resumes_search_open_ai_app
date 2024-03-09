const bcrypt = require('bcrypt');
const { HttpStatusCode, UserRole } = require('../common/constants');
const securityService = require('./security.service');
const notificationService = require('./notification.service');
const User = require('../models/user');

/**
 * Find user by id
 * @param {Number} id 
 * @returns {UserModel}
 */
exports.findUserById = async (id) => {
    if (!id) throw new Error('Invalid input argument for id');

    const user = await User.findOne({
        attributes: ['id', 'email', 'first_name', 'last_name', 'phone', 'last_password_update',
            'enabled', 'failed_login_count', 'role_id', 'last_signed_in', 'createdAt'],
        where: { id: id }
    });

    return user;
}

/**
 * Find user by email address
 * @param {String} email 
 * @returns {UserModel}
 */
exports.findUserByEmail = async (email) => {
    if (!email) throw new Error('Invalid input argument for email');

    const user = await User.findOne({
        attributes: ['id', 'email', 'first_name', 'last_name', 'createdAt'],
        where: { email: email }
    });

    return user;
}

/**
 * Create a new user
 * @param {UserModel} user 
 * @returns {UserModel}
 */
exports.createUser = async (user) => {
    if (!user) { 
        const error = new Error('Invalid input argument.');
        error.statusCode = HttpStatusCode.BAD_REQUEST;
        throw error;
    }

    const existingUser = await exports.findUserByEmail(user?.email);

    if (existingUser) {
        const error = new Error('User already exists.');
        error.statusCode = HttpStatusCode.CONFLICT;
        throw error;
    }

    const hashedPassword = await securityService.getHashedPassword(user.password);
    user.password = hashedPassword;
    const result = await User.create(user);

    return result;
}

/**
 * Update user record
 * @param {UserModel} user 
 */
exports.updateUser = async (user) => {
    if (!user || !user.id) {
        const error = new Error('Invalid input argument.');
        error.statusCode = HttpStatusCode.BAD_REQUEST;
        throw error;
    }

    const existingUser = await exports.findUserById(user.id);

    if (!existingUser) {
        const error = new Error('Requested user not found');
        error.statusCode = HttpStatusCode.NOT_FOUND;
        throw error;
    }

    existingUser.first_name = user.first_name;
    existingUser.last_name = user.last_name;
    existingUser.email = user.email;
    existingUser.phone = user.phone;
    existingUser.role_id = user.role_id;
    existingUser.enabled = user.enabled;

    await existingUser.save();
}

/**
 * Delete user from table
 * @param {Number} id 
 */
exports.deleteUser = async (id) => {
    if (isNaN(id)) {
        const err = new Error("Invalid id provided for user delete");
        err.statusCode = HttpStatusCode.BAD_REQUEST;
        throw err;
    }

    await User.destroy({ where: {id: id}});
}

/**
 * Allows user to sign up for account
 * @param {*} user 
 */
exports.accountSignUp = async (user) => {
    if (!user) {
        const error = new Error('Invalid input argument.');
        error.statusCode = HttpStatusCode.BAD_REQUEST;
        throw error;
    }

    const existingUser = await exports.findUserByEmail(user?.email);

    if (existingUser) {
        const error = new Error('User already exists.');
        error.statusCode = HttpStatusCode.CONFLICT;
        throw error;
    }

    user.role_id = UserRole.USER;
    user.email_verified = false;
    user.enabled = false;
    const result = await exports.createUser(user);

    const verificationToken = securityService.getEmailVerificationToken(
        {email: user.email, first_name: user.first_name, last_name: user.last_name});
    user.emailVerificationToken = verificationToken;
    await notificationService.sendEmailVerification(user);

    return result;
}

exports.verifyEmail = async (emailVerificationToken) => {
    const result = await securityService.verifyEmailToken(emailVerificationToken);

    const existingUser = await exports.findUserByEmail(result.email);
    if (!existingUser) {
        const error = new Error(`User with email ${result.email} does not exist`);
        error.statusCode = HttpStatusCode.NOT_FOUND;
        throw error;
    }

    existingUser.email_verified = true;
    existingUser.enabled = true;
    await existingUser.save();
    await notificationService.sendEmailHasBeenVerified(existingUser);

    return result;
}

/**
 * Change user password
 * @param {*} user model
 */
exports.changePassword = async (email, oldPassword, newPassword) => {
    if (!email || !oldPassword || !newPassword) {
        const error = new Error('Invalid input provided for password change');
        error.statusCode = HttpStatusCode.BAD_REQUEST;
        throw error;
    }

    const authenticatedUser = await securityService.authenticateUser(email, oldPassword);

    const hashedPassword = await securityService.getHashedPassword(newPassword);
    authenticatedUser.password = hashedPassword;
    authenticatedUser.save();
};

/**
 * Initiate forgot password request
 * @param {*} email 
 */
exports.forgotPassword = async (email) => {
    if (!email) {
        const error = new Error('Invalid input, email address is required');
        error.statusCode = HttpStatusCode.BAD_REQUEST;
        throw error;
    }

    const user = await exports.findUserByEmail(email);
    if (!user) {
        const error = new Error(`User with email ${email} does not exist`);
        error.statusCode = HttpStatusCode.NOT_FOUND;
        throw error;
    }

    const token = securityService.getPasswordResetToken({ email });
    await notificationService.sendPasswordResetEmail({
        email,
        first_name: user.first_name,
        last_name: user.last_name,
        passwordResetToken: token
    });
};

/**
 * Resets the password
 * @param {*} token 
 * @param {*} newPassword 
 */
exports.resetPassword = async (token, newPassword) => {
    if (!token || !newPassword) {
        const error = new Error('Invalid input, token and new password are required');
        error.statusCode = HttpStatusCode.BAD_REQUEST;
        throw error;
    }

    const result = securityService.verifyPasswordResetToken(token);
    const user = await exports.findUserByEmail(result.email);

    if (!user) {
        const error = new Error(`User with email ${result.email} does not exist`);
        error.statusCode = HttpStatusCode.NOT_FOUND;
        throw error;
    }
        
    const hashedPassword = await securityService.getHashedPassword(newPassword);
    user.password = hashedPassword;
    user.save();
}