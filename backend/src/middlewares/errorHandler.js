const { error } = require('../utils/response');

/**
 * Middleware untuk menangani route yang tidak ditemukan (404 Not Found)
 */
const notFoundHandler = (req, res, next) => {
  return error(
    res,
    `Endpoint API '${req.originalUrl}' dengan method '${req.method}' tidak ditemukan.`,
    404
  );
};

/**
 * Global Error Handling Middleware (500 Internal Server Error)
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error('[Global Error]', err.stack || err.message || err);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Terjadi kesalahan pada server internal.'
    : (err.message || 'Internal Server Error');

  return error(res, message, statusCode, process.env.NODE_ENV === 'development' ? { stack: err.stack } : null);
};

module.exports = { notFoundHandler, globalErrorHandler };
