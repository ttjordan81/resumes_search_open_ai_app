const accountService = require('../services/account.service');
const { HttpStatusCode } = require('../common/constants');

/**
 * Allows user to change their password
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    try {
        await accountService.changePassword(req.context.email, oldPassword, newPassword);
        log.info(`User changed password`);
        return res.status(HttpStatusCode.ACCEPTED).send();
    } catch (err) {
        log.error(`Password change failed`, err);
        next(err);
    }
}