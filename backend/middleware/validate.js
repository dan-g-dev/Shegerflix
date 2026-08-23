/**
 * middleware/validate.js
 * ------------------------------------------------------------
 * Runs after express-validator's `body()/query()` checks and
 * turns any validation failures into a 400 response.
 * ------------------------------------------------------------
 */
const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed.', errors: errors.array() });
  }
  next();
}

module.exports = validate;
