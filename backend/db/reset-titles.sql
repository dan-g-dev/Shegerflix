-- reset-titles.sql
-- ------------------------------------------------------------
-- Clears movie/series data ONLY. Keeps users, genres, and the
-- schema itself untouched. Run this once, then `npm run seed`
-- to repopulate cleanly with the corrected title list.
-- ------------------------------------------------------------
USE shegerflix;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE title_genres;
TRUNCATE TABLE my_list;
TRUNCATE TABLE watch_history;
TRUNCATE TABLE titles;
SET FOREIGN_KEY_CHECKS = 1;
