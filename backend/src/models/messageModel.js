// backend/src/models/messageModel.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initMessageTable() {
  // Open the existing DB or create if missing
  const db = await open({
    filename: "./data/teams_clone.db",
    driver: sqlite3.Database,
  });

  // Create the messages table if it doesn’t exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_read INTEGER DEFAULT 0
    );
  `);

  console.log("✅ Messages table initialized successfully");

  await db.close();
}
