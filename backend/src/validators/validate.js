const { validationResult } = require('express-validator');
const { validationError } = require('../utils/response');

/**
 * Middleware wrapper untuk mengecek hasil express-validator.
 * Jika terdapat error validasi, langsung kembalikan response 422 Unprocessable Entity.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return validationError(res, formattedErrors);
  }
  next();
};

module.exports = validate;
