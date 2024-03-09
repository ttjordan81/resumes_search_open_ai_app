const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HttpStatusCode } = require('../common/constants');
const User = require('../models/user');

const JWT_SECRET = 'uAeNhK5xsUXM15TNou65tgU8VHdcNvhXbzGIqXo7Qo4WkxwKONBlz4UHlLc9';
const JWT_SECRET_FOR_EMAIL_VERIFICATION = 'f1IY3sc8cvqF/yJ2hVHnAr1euXunSnA6ynk0bnxVHn5A0eLc+cYPJ64YYNwL';
const JWT_SECRET_FOR_PASSWORD_RESET = 'dbYwawB86Xx7GLCrfGps7XNjZBk+2+5YqaXnIUwBzIUcXrUCZbpiDphP0zB8Hqkz';

/**
 * Authenticates the user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns  {}
 */
exports.authenticateUser = async (email, password) => {

    if (!email || !password)  {
        const error = new Error('Invalid input arguments');
        error.statusCode = HttpStatusCode.BAD_REQUEST;
        throw error;
    } 

    email = email.trim().toLowerCase();
    password = password.trim();

    if (email === '' || password === '') {
        const error = new Error('Invalid input arguments');
        error.statusCode = HttpStatusCode.BAD_REQUEST;
        throw error;
    }

    const existingUser = await User.findOne({where: { email: email}});

    if (!existingUser) {
        const error = new Error('User not found');
        error.statusCode = HttpStatusCode.NOT_FOUND;
        throw error;
    }

    if (!existingUser.enabled) {
        const error = new Error('Account is locked');
        error.statusCode = HttpStatusCode.LOCKED;
        throw error;
    } 

    const isAuthenticated = await bcrypt.compare(password, existingUser.password)

    if (!isAuthenticated) {
        await this.updateFailedLoginCount(email);
        await this.lockUserOnMaxLoginAttempt(email);
        const error = new Error('Authentication failed');
        error.statusCode = HttpStatusCode.UNAUTHORIZED;
        throw error
    }

    await this.updateUserOnLoginSuccess(email);

    // TODO: need to check if password is expired and prompt user to update

    delete existingUser.password;

    return Promise.resolve(existingUser);
}

/**
 * Creates the signed authenticated response body
 * @param {*} user model
 * @param {string} user_role
 * @returns
 */
exports.createAuthenticatedResponseBody = (user) => {
    const responseBody = {
        user_id: user.id,
        email: user.email,
        role: user.role_id,
        first_name: user.first_name,
        last_name: user.last_name,
        expiresAt: this.get_expiration_time()
    };
    responseBody.token = this.getJwtToken(responseBody);

    return responseBody;
};

/**
 * Get the session expiration in epoch times
 * @param {*} user model
 * @param {*} user_role
 * @returns
 */
exports.get_expiration_time = () => {
    let session_duration_min = (process.env.SESSION_TIMEOUT || 30) + '';
    session_duration_min = session_duration_min.replace('m', '');
    return new Date().getTime() + session_duration_min * 60 * 1000;
};

/**
 * Generates a JWT Token with the provided payload
 * @param {*} payload is json of format : {"field1": "val1", "field2": "val2", ...}
 * @returns JWT Token
 */
exports.getJwtToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET || JWT_SECRET, {
        expiresIn: process.env.SESSION_TIMEOUT || '30m'
    });

    return token;
};

/** 
 * Verify JWT token
 * @param {string} token - JWT Token
 * @returns JWT Token
 */
exports.verifyToken = (token) => {
   return jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
};

/**
 * Update user record upon successful login with new timestamp and reset on failed login counts
 * @param {string} username
 */
exports.updateUserOnLoginSuccess = async (email) => {
    await User.update(
        { 
            last_signed_in: Date.now(),
            failed_login_count: 0 
        },
        { where: { email: email } }
    );
}

/**
 * Update user record on login failure
 * @param {userModel} user
 */
exports.updateFailedLoginCount = async (email) => {
    await User.increment(
        { failed_login_count: 1 },
        { where: { email: email } }
    );
}

/**
 * Disable user account if number of login exceeds max allowed
 * @param {userModel} user
 * @returns {boolean} - true if locked out, else false
 */
exports.lockUserOnMaxLoginAttempt = async (email) => {
    const max_login = process.env.MAX_FAILED_LOGIN_ATTEMPTS || 5;
    
    const user = await User.findOne({
        attributes: ['failed_login_count'],
        where: { email: email}
    });

    if (user.failed_login_count >= max_login) {
        await User.update(
            { enabled: false }, 
            { where: { email: email } }
        );
    }
}

/**
 * Generates a JWT Token for email confirmation
 * @param {*} payload is json of format : {"field1": "val1", "field2": "val2", ...}
 * @returns JWT Token
 */
exports.getEmailVerificationToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_FOR_EMAIL_VERIFICATION || JWT_SECRET_FOR_EMAIL_VERIFICATION, {
        expiresIn: '14 days'
    });

    return token;
};

/** 
 * Verify JWT token for Email Confirmation
 * @param {string} token - JWT Token
 * @returns JWT Token
 */
exports.verifyEmailToken = (token) => {
   return jwt.verify(token, process.env.JWT_SECRET_FOR_EMAIL_VERIFICATION || JWT_SECRET_FOR_EMAIL_VERIFICATION );
};

/**
 * Generates a JWT Token for password reset
 * @param {*} payload 
 * @returns {string} - JWT Token
 */
exports.getPasswordResetToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_FOR_PASSWORD_RESET || JWT_SECRET_FOR_PASSWORD_RESET, {
        expiresIn: '1h'
    });

    return token;
}

/** 
 * Verify JWT token for Password reset
 * @param {string} token - JWT Token
 * @returns JWT Token
 */
exports.verifyPasswordResetToken = (token) => {
   return jwt.verify(token, process.env.JWT_SECRET_FOR_PASSWORD_RESET || JWT_SECRET_FOR_PASSWORD_RESET );
};

/**
 * Creates the hashed password for the user
 * @param {string} password  
 * @returns {string} hashed password
 */
exports.getHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};