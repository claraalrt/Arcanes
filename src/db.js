import Database from "better-sqlite3";
import fs from "node:fs";

fs.mkdirSync("./data", { recursive: true });

export const db = new Database("./data/arcanis.db");

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  house TEXT,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  gallions INTEGER NOT NULL DEFAULT 50,
  character_json TEXT,
  PRIMARY KEY (guild_id, user_id)
);

CREATE TABLE IF NOT EXISTS house_points (
  guild_id TEXT NOT NULL,
  house TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (guild_id, house)
);

CREATE TABLE IF NOT EXISTS inventory (
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  item TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (guild_id, user_id, item)
);

CREATE TABLE IF NOT EXISTS learned_spells (
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  spell TEXT NOT NULL,
  PRIMARY KEY (guild_id, user_id, spell)
);

CREATE TABLE IF NOT EXISTS warnings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  moderator_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS config (
  guild_id TEXT PRIMARY KEY,
  setup_done INTEGER NOT NULL DEFAULT 0
);
`);

export function ensureUser(guildId, userId) {
  db.prepare(`
    INSERT OR IGNORE INTO users
    (guild_id, user_id)
    VALUES (?, ?)
  `).run(guildId, userId);
}

export function getUser(guildId, userId) {
  ensureUser(guildId, userId);

  return db.prepare(`
    SELECT *
    FROM users
    WHERE guild_id = ?
    AND user_id = ?
  `).get(guildId, userId);
}

export function saveCharacter(guildId, userId, character) {
  ensureUser(guildId, userId);

  db.prepare(`
    UPDATE users
    SET character_json = ?
    WHERE guild_id = ?
    AND user_id = ?
  `).run(
    JSON.stringify(character),
    guildId,
    userId
  );
}

export function addXP(guildId, userId, amount) {
  const user = getUser(guildId, userId);

  const xp = user.xp + amount;
  const level = Math.max(
    1,
    Math.floor(xp / 100) + 1
  );

  db.prepare(`
    UPDATE users
    SET xp = ?, level = ?
    WHERE guild_id = ?
    AND user_id = ?
  `).run(
    xp,
    level,
    guildId,
    userId
  );

  return getUser(guildId, userId);
}

export function addGallions(guildId, userId, amount) {
  getUser(guildId, userId);

  db.prepare(`
    UPDATE users
    SET gallions = gallions + ?
    WHERE guild_id = ?
    AND user_id = ?
  `).run(
    amount,
    guildId,
    userId
  );

  return getUser(guildId, userId);
}

export function addHousePoints(
  guildId,
  house,
  amount
) {
  db.prepare(`
    INSERT OR IGNORE INTO house_points
    (guild_id, house, points)
    VALUES (?, ?, 0)
  `).run(
    guildId,
    house
  );

  db.prepare(`
    UPDATE house_points
    SET points = MAX(0, points + ?)
    WHERE guild_id = ?
    AND house = ?
  `).run(
    amount,
    guildId,
    house
  );
}

export function getHousePoints(guildId) {
  return db.prepare(`
    SELECT house, points
    FROM house_points
    WHERE guild_id = ?
    ORDER BY points DESC
  `).all(guildId);
}

export function addItem(
  guildId,
  userId,
  item,
  quantity
) {
  ensureUser(guildId, userId);

  db.prepare(`
    INSERT INTO inventory
    (guild_id, user_id, item, qty)
    VALUES (?, ?, ?, ?)

    ON CONFLICT(
      guild_id,
      user_id,
      item
    )

    DO UPDATE SET
      qty = qty + excluded.qty
  `).run(
    guildId,
    userId,
    item,
    quantity
  );
}

export function getInventory(
  guildId,
  userId
) {
  return db.prepare(`
    SELECT item, qty
    FROM inventory
    WHERE guild_id = ?
    AND user_id = ?
    AND qty > 0
  `).all(
    guildId,
    userId
  );
}
