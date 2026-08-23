/**
 * controllers/myListController.js
 * ------------------------------------------------------------
 * Add/remove/view titles a user has saved to "My List".
 * All routes require auth; a user can only see/modify their own list.
 * ------------------------------------------------------------
 */
const pool = require('../config/db');

async function getMyList(req, res, next) {
  try {
    const sql = `
      SELECT t.* FROM titles t
      JOIN my_list ml ON ml.title_id = t.id
      WHERE ml.user_id = ?
      ORDER BY ml.added_at DESC`;
    const [rows] = await pool.query(sql, [req.user.id]);
    res.json({ titles: rows });
  } catch (err) {
    next(err);
  }
}

async function addToMyList(req, res, next) {
  try {
    const { titleId } = req.body;
    const [[title]] = await pool.query('SELECT id FROM titles WHERE id = ?', [titleId]);
    if (!title) return res.status(404).json({ message: 'Title not found.' });

    await pool.query(
      'INSERT IGNORE INTO my_list (user_id, title_id) VALUES (?, ?)',
      [req.user.id, titleId]
    );
    res.status(201).json({ message: 'Added to My List.' });
  } catch (err) {
    next(err);
  }
}

async function removeFromMyList(req, res, next) {
  try {
    const { titleId } = req.params;
    await pool.query('DELETE FROM my_list WHERE user_id = ? AND title_id = ?', [req.user.id, titleId]);
    res.json({ message: 'Removed from My List.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyList, addToMyList, removeFromMyList };
