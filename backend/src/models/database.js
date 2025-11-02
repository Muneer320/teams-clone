// src/models/database.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";

// Use the same database file as initDB.js
const dbPath = path.resolve("./database.sqlite");

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Open the database connection using async/await
const dbPromise = open({
  filename: dbPath,
  driver: sqlite3.Database,
});

// Initialize database tables if they don't exist
async function initializeTables() {
  try {
    const db = await dbPromise;
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        nickname TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT UNIQUE,
        theme TEXT DEFAULT 'default',
        whoCanAddToGroup TEXT DEFAULT 'everyone',
        whoCanCall TEXT DEFAULT 'everyone',
        read_receipt BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contact (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user1_id INTEGER NOT NULL,
        user2_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user1_id, user2_id),
        FOREIGN KEY (user1_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (user2_id) REFERENCES user(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS blocked (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        victim_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, victim_id),
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (victim_id) REFERENCES user(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS community_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        share_link TEXT UNIQUE,
        isApprovalRequired BOOLEAN DEFAULT 0,
        created_by_user_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by_user_id) REFERENCES user(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS community_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        community_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        role TEXT DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(community_id, user_id),
        FOREIGN KEY (community_id) REFERENCES community_list(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
      );
    `);
    
    console.log("✅ Connected to SQLite database and tables initialized.");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  }
}

initializeTables();

// Export the database connection for use in other files
export default dbPromise;
