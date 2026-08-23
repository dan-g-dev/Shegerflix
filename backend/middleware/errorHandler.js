/**
 * middleware/errorHandler.js
 * ------------------------------------------------------------
 * Catches errors passed via next(err) from any route/controller
 * and returns a consistent JSON shape instead of leaking stack
 * traces to the client.
 * ------------------------------------------------------------
 */
function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Something went wrong on the server.'
      : err.message || 'Internal server error.';

  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
