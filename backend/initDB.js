// import sqlite3 from "sqlite3";
// import { open } from "sqlite";

// async function initDB() {
//   // Open (or create) the database file
//   const db = await open({
//     filename: "./database.sqlite",
//     driver: sqlite3.Database,
//   });

//   console.log("✅ Connected to SQLite database");

//   // === Create tables ===
//   await db.exec(`
//     CREATE TABLE IF NOT EXISTS user (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       nickname TEXT,
//       email TEXT UNIQUE NOT NULL,
//       password TEXT NOT NULL,
//       phone TEXT UNIQUE,
//       theme TEXT DEFAULT 'default',
//       whoCanAddToGroup TEXT DEFAULT 'everyone',
//       whoCanCall TEXT DEFAULT 'everyone',
//       read_receipt BOOLEAN DEFAULT 1,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE TABLE IF NOT EXISTS contact (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       user1_id INTEGER NOT NULL,
//       user2_id INTEGER NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       UNIQUE(user1_id, user2_id),
//       FOREIGN KEY (user1_id) REFERENCES user(id) ON DELETE CASCADE,
//       FOREIGN KEY (user2_id) REFERENCES user(id) ON DELETE CASCADE
//     );

//     CREATE TABLE IF NOT EXISTS blocked (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       user_id INTEGER NOT NULL,
//       victim_id INTEGER NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       UNIQUE(user_id, victim_id),
//       FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
//       FOREIGN KEY (victim_id) REFERENCES user(id) ON DELETE CASCADE
//     );

//     CREATE TABLE IF NOT EXISTS community_list (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       share_link TEXT UNIQUE,
//       isApprovalRequired BOOLEAN DEFAULT 0,
//       created_by_user_id INTEGER,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (created_by_user_id) REFERENCES user(id) ON DELETE SET NULL
//     );

//     CREATE TABLE IF NOT EXISTS community_members (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       community_id INTEGER NOT NULL,
//       user_id INTEGER NOT NULL,
//       role TEXT DEFAULT 'member',
//       joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       UNIQUE(community_id, user_id),
//       FOREIGN KEY (community_id) REFERENCES community_list(id) ON DELETE CASCADE,
//       FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
//     );
//   `);

//   console.log("✅ Tables created successfully");

//   await db.close();
//   console.log("✅ Database setup complete!");
// }

// initDB().catch((err) => console.error("❌ DB init error:", err));


// import { initMessageTable } from "./src/models/messageModel.js";
import { initActivityTable } from "./src/models/activityModel.js";

async function initDB() {
  // await initMessageTable();
  await initActivityTable();
  console.log("All tables initialized ✅");
}

initDB();
