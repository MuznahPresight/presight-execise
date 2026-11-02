export const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    avatar      TEXT    NOT NULL,
    first_name  TEXT    NOT NULL COLLATE NOCASE,
    last_name   TEXT    NOT NULL COLLATE NOCASE,
    age         INTEGER NOT NULL CHECK (age BETWEEN 0 AND 120),
    nationality TEXT    NOT NULL COLLATE NOCASE
  );

  CREATE TABLE IF NOT EXISTS hobbies (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE COLLATE NOCASE
  );

  CREATE TABLE IF NOT EXISTS user_hobbies (
    user_id  INTEGER NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    hobby_id INTEGER NOT NULL REFERENCES hobbies(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, hobby_id)
  ) WITHOUT ROWID;

  CREATE TRIGGER IF NOT EXISTS trg_user_hobbies_max
  BEFORE INSERT ON user_hobbies
  WHEN (SELECT COUNT(*) FROM user_hobbies WHERE user_id = NEW.user_id) >= 10
  BEGIN
    SELECT RAISE(ABORT, 'A user can have at most 10 hobbies');
  END;

  -- Indexes for search, filters and filter counts
  CREATE INDEX IF NOT EXISTS idx_users_nationality ON users(nationality);
  CREATE INDEX IF NOT EXISTS idx_users_age         ON users(age);
  CREATE INDEX IF NOT EXISTS idx_users_first_name  ON users(first_name);
  CREATE INDEX IF NOT EXISTS idx_users_last_name   ON users(last_name);
  CREATE INDEX IF NOT EXISTS idx_user_hobbies_hobby ON user_hobbies(hobby_id);
`;