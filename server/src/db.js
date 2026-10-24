// SQLite bazası (Node 22-nin daxili node:sqlite modulu).
import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { randomBytes } from 'node:crypto'

export const newId = (prefix) => `${prefix}_${randomBytes(6).toString('hex')}`

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  avatar        TEXT,
  bio           TEXT NOT NULL DEFAULT '',
  phone         TEXT NOT NULL DEFAULT '',
  whatsapp      INTEGER NOT NULL DEFAULT 0,
  show_phone    INTEGER NOT NULL DEFAULT 1,
  contact_pref  TEXT NOT NULL DEFAULT 'Mesaj',
  district      TEXT NOT NULL DEFAULT '',
  delivery      TEXT NOT NULL DEFAULT '["meet"]',
  verified      INTEGER NOT NULL DEFAULT 0,
  fast_reply    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS listings (
  id          TEXT PRIMARY KEY,
  owner_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'diger',
  dept        TEXT,
  sub         TEXT,
  price       INTEGER NOT NULL DEFAULT 0,
  condition   TEXT NOT NULL DEFAULT '',
  district    TEXT NOT NULL DEFAULT '',
  modes       TEXT NOT NULL,              -- JSON: ["sale","swap"] və ya ["free"]
  images      TEXT NOT NULL DEFAULT '[]', -- JSON: şəkil linkləri
  description TEXT NOT NULL DEFAULT '',
  story       TEXT,
  wants       TEXT NOT NULL DEFAULT '[]', -- JSON: kateqoriya id-ləri
  wants_text  TEXT NOT NULL DEFAULT '[]', -- JSON: sərbəst mətn
  delivery    TEXT NOT NULL DEFAULT '["meet"]',
  defect      TEXT,
  repair      TEXT,
  aspect      TEXT NOT NULL DEFAULT 'square',
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','sold','hidden')),
  likes_base  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS listings_owner ON listings(owner_id);
CREATE INDEX IF NOT EXISTS listings_status ON listings(status, created_at);

CREATE TABLE IF NOT EXISTS favorites (
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS offers (
  id                TEXT PRIMARY KEY,
  from_user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  offered_listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  cash              INTEGER NOT NULL DEFAULT 0,
  note              TEXT NOT NULL DEFAULT '',
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','cancelled')),
  created_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS offers_to ON offers(to_user_id);
CREATE INDEX IF NOT EXISTS offers_from ON offers(from_user_id);

CREATE TABLE IF NOT EXISTS conversations (
  id         TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (listing_id, buyer_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id              TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text            TEXT NOT NULL,
  read_at         TEXT,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS messages_conv ON messages(conversation_id, created_at);

CREATE TABLE IF NOT EXISTS collections (
  id         TEXT PRIMARY KEY,
  owner_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  text       TEXT NOT NULL DEFAULT '',
  is_public  INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS collection_items (
  collection_id TEXT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  listing_id    TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  added_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (collection_id, listing_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id          TEXT PRIMARY KEY,
  author_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stars       INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
  text        TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (author_id, target_id)
);
`

export function openDb(path = ':memory:') {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true })
  const db = new DatabaseSync(path)
  db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;')
  db.exec(SCHEMA)
  return db
}

// Bir neçə yazını birlikdə: ya hamısı, ya heç biri
export function transaction(db, fn) {
  db.exec('BEGIN')
  try {
    const result = fn()
    db.exec('COMMIT')
    return result
  } catch (e) {
    db.exec('ROLLBACK')
    throw e
  }
}
