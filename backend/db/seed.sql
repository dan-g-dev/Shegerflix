USE shegerflix;

-- ------------------------------------------------------------
-- USERS
-- password for BOTH demo accounts is: Password123!
-- hash generated with bcrypt (10 rounds) — verified in seed.js at runtime instead,
-- this file is kept for reference / manual `mysql < seed.sql` imports.
-- Prefer running `npm run seed` (backend/db/seed.js) which hashes passwords live.
-- ------------------------------------------------------------

INSERT INTO genres (name) VALUES
('Drama'), ('Comedy'), ('Action'), ('Romance'), ('Documentary'),
('Historical'), ('Family'), ('Thriller'), ('Music'), ('Crime');

-- Users, titles, title_genres are inserted by db/seed.js (needs bcrypt to hash
-- passwords correctly). Run:
--   cd backend && npm run seed
-- This .sql file only sets up genres so a plain `mysql -u root -p shegerflix < seed.sql`
-- still leaves the DB in a sane state before you run the Node seeder.
