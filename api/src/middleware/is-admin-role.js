const { HttpStatusCode, UserRole } = require('../common/constants');

module.exports = (req, res, next) => {
    if (req.context?.role === UserRole.ADMIN) {
        return next();
    }

    const err = new Error("Unauthorized");
    err.statusCode = HttpStatusCode.UNAUTHORIZED;
    return next(err);
}