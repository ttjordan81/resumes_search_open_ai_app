const { HttpStatusCode } = require('../common/constants');

exports.validateData = (schema) => (req, res, next) => {
    let data = null;

    if (req.method === 'GET' || req.method === 'DELETE') {
        data = {...req.query, ...req.params};
    } else {
        data = req.body;
    }

    if (!schema) {
        const err = new Error("Validation schema not provided");
        err.statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
        return next(err);
    }

    const { error } = schema.validate(data);

    if (error) {
        const err = new Error(error.message);
        err.statusCode = HttpStatusCode.BAD_REQUEST;
        return next(err);
    }

    req.validatedData = {...data};

    next();
}