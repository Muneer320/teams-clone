// backend/src/models/activityModel.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initActivityTable() {
  const db = await open({
    filename: "./data/teams_clone.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✅ Activity table initialized successfully");

  await db.close();
}
