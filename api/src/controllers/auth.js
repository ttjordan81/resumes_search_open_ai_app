const securityService = require('../services/security.service');
const accountService = require('../services/account.service');
const { HttpStatusCode } = require('../common/constants');

/**
 * Authenticates a user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const userModel = await securityService.authenticateUser(email, password);
        const responseBody = securityService.createAuthenticatedResponseBody(userModel);
        log.info(`User ${email} login succesfully`);
        res.status(HttpStatusCode.OK).send(responseBody);
    } catch (err) {
        log.error(`Login failed for user ${email}`, err);
        next(err);
    }
}

/**
 * Self-Service account registration
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.accountSignUp = async (req, res, next) => {
    const user = req.body;
    try {
        await accountService.accountSignUp(user);
        log.info(`Account successfully signed up for ${user.email}`);
        return res.status(HttpStatusCode.CREATED).send();
    } catch (err) {
        log.error(`An error has occurred while registering user with id: ${user?.email}`, err);
        err.statusCode = HttpStatusCode.NOT_ACCEPTABLE;
        next(err)
    }
}

/**
 * Email verification 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.verifyEmail = async (req, res, next) => {
    const emailToken = req.params.emailVerificationToken;
    try {
        const result = await accountService.verifyEmail(emailToken);
        log.info(`User Email account verified for: ${result?.email}`);
        return res.status(HttpStatusCode.ACCEPTED).render("account_email_verified", result);
    } catch (err) {
        log.error(`Email verification failed for: ${emailToken}`, err);
        err.statusCode = HttpStatusCode.NOT_ACCEPTABLE;
        next(err);
    }
}

/**
 * Forgot password
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.validatedData;

    try {
        await accountService.forgotPassword(email);
        log.info(`Forgot password requested for email : ${email}`);
    } catch (err) {
        log.error(`Forgot password request failed for ${email}`, err);
    }

    return res.status(HttpStatusCode.OK).send("A password reset email will be sent to your email address if account exists");
}

/**
 * Self-Service account password reset
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.resetPassword = async (req, res, next) => {
    const { email, newPassword, token } = req.validatedData;

    try {
        await accountService.resetPassword(token, newPassword);
        log.info(`Password reset for login email: ${email}`);
    } catch (err) {
        log.error(`Password reset failed for ${email}`, err);
        return next(err);
    }

    return res.status(HttpStatusCode.ACCEPTED).send();
}