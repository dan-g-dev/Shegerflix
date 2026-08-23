const express = require('express');
const {
  listTitles, homepageCollections, searchTitles, getTitleBySlug, listGenres,
} = require('../controllers/titlesController');

const router = express.Router();

router.get('/collections', homepageCollections);
router.get('/search', searchTitles);
router.get('/genres', listGenres);
router.get('/:slug', getTitleBySlug);
router.get('/', listTitles);

module.exports = router;
