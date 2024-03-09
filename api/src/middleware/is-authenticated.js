const securityService = require('../services/security.service');
const { HttpStatusCode } = require('../common/constants');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const err = new Error("Bad Request");
        err.statusCode = HttpStatusCode.BAD_REQUEST;
        return next(err);
    }

    try {
        const token = authHeader.replace(/^bearer +/i, '');
        req.context = securityService.verifyToken(token);
        next();
    } catch (err) {
        err.statusCode = HttpStatusCode.UNAUTHORIZED;
        next(err);
    }
}