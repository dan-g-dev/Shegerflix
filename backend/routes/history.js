const express = require('express');
const { body } = require('express-validator');
const { getHistory, getContinueWatching, upsertProgress } = require('../controllers/historyController');
const { requireAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
router.use(requireAuth);

router.get('/', getHistory);
router.get('/continue-watching', getContinueWatching);
router.post(
  '/',
  [
    body('titleId').isInt().withMessage('titleId must be an integer.'),
    body('progressSeconds').isInt({ min: 0 }).withMessage('progressSeconds must be a non-negative integer.'),
  ],
  validate,
  upsertProgress
);

module.exports = router;
