const express = require('express');
const { body } = require('express-validator');
const { createTitle, updateTitle, deleteTitle, listUsers } = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
router.use(requireAuth, requireAdmin);

const titleValidation = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('type').isIn(['movie', 'series']).withMessage('type must be movie or series.'),
  body('language').isIn(['Amharic', 'Afaan Oromoo', 'Tigrinya', 'International']).withMessage('Invalid language.'),
];

router.post('/titles', titleValidation, validate, createTitle);
router.put('/titles/:id', updateTitle);
router.delete('/titles/:id', deleteTitle);
router.get('/users', listUsers);

module.exports = router;
