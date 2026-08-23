/**
 * controllers/adminController.js
 * ------------------------------------------------------------
 * Admin-only CRUD for titles. All routes here are mounted behind
 * requireAuth + requireAdmin (see routes/admin.js).
 * ------------------------------------------------------------
 */
const pool = require("../config/db");

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function createTitle(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const {
      title,
      description,
      type,
      language,
      releaseYear,
      durationMinutes,
      seasons,
      posterUrl,
      backdropUrl,
      videoUrl,
      rating,
      isFeatured,
      collection,
      genreIds = [],
    } = req.body;

    const slug = slugify(title);

    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO titles
        (title, slug, description, type, language, release_year, duration_minutes,
         seasons, poster_url, backdrop_url, video_url, rating, is_featured, collection, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        description,
        type,
        language,
        releaseYear || null,
        durationMinutes || null,
        seasons || null,
        posterUrl || `/assets/posters/${slug}.jpg`,
        backdropUrl || `/assets/backdrops/${slug}.jpg`,
        videoUrl || "/assets/sample-video.mp4",
        rating || 0,
        !!isFeatured,
        collection || null,
        req.user.id,
      ],
    );

    const titleId = result.insertId;
    for (const genreId of genreIds) {
      await conn.query(
        "INSERT IGNORE INTO title_genres (title_id, genre_id) VALUES (?, ?)",
        [titleId, genreId],
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Title created.", titleId });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

async function updateTitle(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type,
      language,
      releaseYear,
      durationMinutes,
      seasons,
      posterUrl,
      backdropUrl,
      videoUrl,
      rating,
      isFeatured,
      collection,
      genreIds,
    } = req.body;

    const [[existing]] = await conn.query("SELECT * FROM titles WHERE id = ?", [
      id,
    ]);
    if (!existing) return res.status(404).json({ message: "Title not found." });

    await conn.beginTransaction();

    await conn.query(
      `UPDATE titles SET
        title = ?, slug = ?, description = ?, type = ?, language = ?,
        release_year = ?, duration_minutes = ?, seasons = ?,
        poster_url = ?, backdrop_url = ?, video_url = ?, rating = ?,
        is_featured = ?, collection = ?
       WHERE id = ?`,
      [
        title ?? existing.title,
        title ? slugify(title) : existing.slug,
        description ?? existing.description,
        type ?? existing.type,
        language ?? existing.language,
        releaseYear ?? existing.release_year,
        durationMinutes ?? existing.duration_minutes,
        seasons ?? existing.seasons,
        posterUrl ?? existing.poster_url,
        backdropUrl ?? existing.backdrop_url,
        videoUrl ?? existing.video_url,
        rating ?? existing.rating,
        isFeatured ?? existing.is_featured,
        collection ?? existing.collection,
        id,
      ],
    );

    if (Array.isArray(genreIds)) {
      await conn.query("DELETE FROM title_genres WHERE title_id = ?", [id]);
      for (const genreId of genreIds) {
        await conn.query(
          "INSERT IGNORE INTO title_genres (title_id, genre_id) VALUES (?, ?)",
          [id, genreId],
        );
      }
    }

    await conn.commit();
    res.json({ message: "Title updated." });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

async function deleteTitle(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM titles WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Title not found." });
    res.json({ message: "Title deleted." });
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC",
    );
    res.json({ users: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { createTitle, updateTitle, deleteTitle, listUsers };
