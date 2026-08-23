/**
 * controllers/historyController.js
 * ------------------------------------------------------------
 * Tracks playback progress per user/title so the frontend can
 * render "Continue Watching" and a full watch history page.
 * An UPSERT (ON DUPLICATE KEY) keeps one row per user+title.
 * ------------------------------------------------------------
 */
const pool = require('../config/db');

async function getHistory(req, res, next) {
  try {
    const sql = `
      SELECT t.*, wh.progress_seconds, wh.completed, wh.last_watched_at
      FROM watch_history wh
      JOIN titles t ON t.id = wh.title_id
      WHERE wh.user_id = ?
      ORDER BY wh.last_watched_at DESC`;
    const [rows] = await pool.query(sql, [req.user.id]);
    res.json({ history: rows });
  } catch (err) {
    next(err);
  }
}

async function getContinueWatching(req, res, next) {
  try {
    const sql = `
      SELECT t.*, wh.progress_seconds, wh.completed, wh.last_watched_at
      FROM watch_history wh
      JOIN titles t ON t.id = wh.title_id
      WHERE wh.user_id = ? AND wh.completed = FALSE
      ORDER BY wh.last_watched_at DESC
      LIMIT 20`;
    const [rows] = await pool.query(sql, [req.user.id]);
    res.json({ titles: rows });
  } catch (err) {
    next(err);
  }
}

async function upsertProgress(req, res, next) {
  try {
    const { titleId, progressSeconds, completed = false } = req.body;

    const [[title]] = await pool.query('SELECT id FROM titles WHERE id = ?', [titleId]);
    if (!title) return res.status(404).json({ message: 'Title not found.' });

    await pool.query(
      `INSERT INTO watch_history (user_id, title_id, progress_seconds, completed)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         progress_seconds = VALUES(progress_seconds),
         completed = VALUES(completed),
         last_watched_at = CURRENT_TIMESTAMP`,
      [req.user.id, titleId, progressSeconds, completed]
    );

    res.json({ message: 'Progress saved.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getHistory, getContinueWatching, upsertProgress };
