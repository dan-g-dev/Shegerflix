-- ============================================================
-- ShegerFlix Database Schema (MySQL)
-- ============================================================

DROP DATABASE IF EXISTS shegerflix;
CREATE DATABASE shegerflix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shegerflix;

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)    NOT NULL,
  email         VARCHAR(150)    NOT NULL UNIQUE,
  password_hash VARCHAR(255)    NOT NULL,
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  avatar_url    VARCHAR(255)    DEFAULT NULL,
  created_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- GENRES
-- ------------------------------------------------------------
CREATE TABLE genres (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- TITLES (movies + series, unified table with a `type` column)
-- ------------------------------------------------------------
CREATE TABLE titles (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(200)  NOT NULL,
  slug            VARCHAR(220)  NOT NULL UNIQUE,
  description     TEXT,
  type            ENUM('movie','series') NOT NULL DEFAULT 'movie',
  language        ENUM('Amharic','Afaan Oromoo','Tigrinya','International') NOT NULL DEFAULT 'Amharic',
  release_year    YEAR,
  duration_minutes INT DEFAULT NULL,          -- for movies
  seasons         INT DEFAULT NULL,           -- for series
  poster_url      VARCHAR(255),
  backdrop_url    VARCHAR(255),
  video_url       VARCHAR(255),               -- placeholder / sample stream url
  rating          DECIMAL(3,1) DEFAULT 0.0,   -- 0.0 - 10.0
  is_featured     BOOLEAN DEFAULT FALSE,      -- shows up in Hero rotation
  collection      VARCHAR(50) DEFAULT NULL,   -- e.g. 'Sheger Picks', 'Popular in Ethiopia'
  created_by      INT DEFAULT NULL,           -- admin who added it
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_titles_type (type),
  INDEX idx_titles_language (language),
  INDEX idx_titles_collection (collection),
  FULLTEXT INDEX idx_titles_search (title, description)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- TITLE <-> GENRE (many-to-many)
-- ------------------------------------------------------------
CREATE TABLE title_genres (
  title_id INT NOT NULL,
  genre_id INT NOT NULL,
  PRIMARY KEY (title_id, genre_id),
  FOREIGN KEY (title_id) REFERENCES titles(id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- MY LIST (user's saved titles)
-- ------------------------------------------------------------
CREATE TABLE my_list (
  user_id  INT NOT NULL,
  title_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, title_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (title_id) REFERENCES titles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- WATCH HISTORY / CONTINUE WATCHING
-- progress_seconds + duration lets the frontend compute % watched
-- ------------------------------------------------------------
CREATE TABLE watch_history (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,
  title_id         INT NOT NULL,
  progress_seconds INT NOT NULL DEFAULT 0,
  completed        BOOLEAN NOT NULL DEFAULT FALSE,
  last_watched_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_title (user_id, title_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (title_id) REFERENCES titles(id) ON DELETE CASCADE,
  INDEX idx_history_user_time (user_id, last_watched_at)
) ENGINE=InnoDB;
