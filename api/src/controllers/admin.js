const accountService = require('../services/account.service');
const { HttpStatusCode } = require('../common/constants');

/**
 * Create a new login user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.createUser = async (req, res, next) => {
    const user = req.body;

    try {
        await accountService.createUser(user);
        log.info("New user account created");
    } catch (err) {
        log.error("An error has occurred while creating a new user", err);
        return next(err);
    }

    return res.status(HttpStatusCode.CREATED).send();
}

/**
 * Update user fields
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.updateUser = async (req, res, next) => {
    const user = req.body;

    try {
        await accountService.updateUser(user);
        log.info(`User id ${user.id} record update` );
    } catch (err) {
        log.error(`An error has occurred while updating user with id: ${user.id}`, err);
        return next(err);
    }

    return res.status(HttpStatusCode.ACCEPTED).send();
}

/**
 * Delete a user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteUser = async (req, res, next) => {
    const userId = req.body.id;

    try {
        await accountService.deleteUser(userId);
        log.info(`User id ${userId} deleted`);
    } catch (err) {
        log.error(`An error has occurred while deleting user with id: ${userId}`, err);
        return next(err);
    }

    return res.status(HttpStatusCode.ACCEPTED).send();
}