/**
 * controllers/titlesController.js
 * ------------------------------------------------------------
 * Public read endpoints for browsing movies/series:
 *  - GET /api/titles              (filterable list: type, language, genre, collection)
 *  - GET /api/titles/collections  (grouped rows for the homepage)
 *  - GET /api/titles/search?q=    (full-text-ish search)
 *  - GET /api/titles/:slug        (single title with genres)
 * ------------------------------------------------------------
 */
const pool = require('../config/db');

const BASE_SELECT = `
  SELECT t.*,
    GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR ',') AS genres
  FROM titles t
  LEFT JOIN title_genres tg ON tg.title_id = t.id
  LEFT JOIN genres g ON g.id = tg.genre_id
`;

function mapRow(row) {
  return {
    ...row,
    genres: row.genres ? row.genres.split(',') : [],
  };
}

async function listTitles(req, res, next) {
  try {
    const { type, language, genre, collection, limit = 60 } = req.query;
    const where = [];
    const params = [];

    if (type) { where.push('t.type = ?'); params.push(type); }
    if (language) { where.push('t.language = ?'); params.push(language); }
    if (collection) { where.push('t.collection = ?'); params.push(collection); }
    if (genre) {
      where.push('t.id IN (SELECT tg2.title_id FROM title_genres tg2 JOIN genres g2 ON g2.id = tg2.genre_id WHERE g2.name = ?)');
      params.push(genre);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `${BASE_SELECT} ${whereSql} GROUP BY t.id ORDER BY t.created_at DESC LIMIT ?`;
    params.push(Number(limit));

    const [rows] = await pool.query(sql, params);
    res.json({ titles: rows.map(mapRow) });
  } catch (err) {
    next(err);
  }
}

// Groups titles into the homepage rows: Continue Watching is handled
// separately (needs auth), everything else groups by `collection`.
async function homepageCollections(req, res, next) {
  try {
    const [rows] = await pool.query(`${BASE_SELECT} GROUP BY t.id ORDER BY t.created_at DESC`);
    const titles = rows.map(mapRow);

    const collectionsOrder = [
      'Popular in Ethiopia', 'Ethiopian Movies', 'Ethiopian Series',
      'Sheger Picks', 'Amharic', 'Afaan Oromoo', 'Tigrinya', 'International',
    ];

    const grouped = collectionsOrder
      .map((name) => ({
        collection: name,
        titles: titles.filter((t) => t.collection === name || t.language === name),
      }))
      .filter((c) => c.titles.length > 0);

    const hero = titles.filter((t) => t.is_featured);

    res.json({ hero, collections: grouped });
  } catch (err) {
    next(err);
  }
}

async function searchTitles(req, res, next) {
  try {
    const { q = '' } = req.query;
    if (!q.trim()) return res.json({ titles: [] });

    const sql = `${BASE_SELECT}
      WHERE t.title LIKE ? OR t.description LIKE ?
      GROUP BY t.id
      ORDER BY t.rating DESC
      LIMIT 40`;
    const like = `%${q.trim()}%`;
    const [rows] = await pool.query(sql, [like, like]);
    res.json({ titles: rows.map(mapRow) });
  } catch (err) {
    next(err);
  }
}

async function getTitleBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const sql = `${BASE_SELECT} WHERE t.slug = ? GROUP BY t.id`;
    const [[row]] = await pool.query(sql, [slug]);

    if (!row) return res.status(404).json({ message: 'Title not found.' });
    res.json({ title: mapRow(row) });
  } catch (err) {
    next(err);
  }
}

async function listGenres(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM genres ORDER BY name');
    res.json({ genres: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { listTitles, homepageCollections, searchTitles, getTitleBySlug, listGenres };
