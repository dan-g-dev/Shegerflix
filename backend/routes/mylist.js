const express = require('express');
const { body } = require('express-validator');
const { getMyList, addToMyList, removeFromMyList } = require('../controllers/myListController');
const { requireAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
router.use(requireAuth);

router.get('/', getMyList);
router.post('/', [body('titleId').isInt().withMessage('titleId must be an integer.')], validate, addToMyList);
router.delete('/:titleId', removeFromMyList);

module.exports = router;
