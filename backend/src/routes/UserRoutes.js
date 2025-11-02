import express from "express";
import openDB from "../models/database.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 Apply middleware globally
router.use(verifyToken);

/** Helper function to get user ID by email */
async function getUserIdByEmail(db, email) {
  const user = await db.get("SELECT id FROM user WHERE email = ?", [email]);
  return user ? user.id : null;
}

/* ===========================
   ✅ 1️⃣ GET CONTACTS
=========================== */
router.get("/contacts/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const db = await openDB();
    const userId = await getUserIdByEmail(db, email);
    if (!userId) return res.status(404).json({ success: false, error: "User not found" });

    const contacts = await db.all(
      `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.nickname,
        u.phone,
        u.theme,
        c.created_at AS added_on
      FROM contact c
      JOIN user u 
        ON (u.id = CASE WHEN c.user1_id = ? THEN c.user2_id ELSE c.user1_id END)
      WHERE c.user1_id = ? OR c.user2_id = ?
      ORDER BY c.created_at DESC;
      `,
      [userId, userId, userId]
    );

    res.json({ success: true, contacts });
  } catch (err) {
    console.error("❌ Error fetching contacts:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

/* ===========================
   ✅ 2️⃣ GET CHANNELS
=========================== */
router.get("/channels/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const db = await openDB();
    const userId = await getUserIdByEmail(db, email);
    if (!userId) return res.status(404).json({ success: false, error: "User not found" });

    const channels = await db.all(
      `
      SELECT 
        cl.id AS community_id,
        cl.name AS community_name,
        cl.share_link,
        cl.isApprovalRequired,
        cm.role,
        cm.joined_at,
        u.name AS created_by
      FROM community_members cm
      JOIN community_list cl ON cl.id = cm.community_id
      LEFT JOIN user u ON u.id = cl.created_by_user_id
      WHERE cm.user_id = ?
      ORDER BY cm.joined_at DESC;
      `,
      [userId]
    );

    res.json({ success: true, channels });
  } catch (err) {
    console.error("❌ Error fetching channels:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

/* ===========================
   🧍‍♂️ 3️⃣ ADD FRIEND
=========================== */
router.post("/add-friend", async (req, res) => {
  const { user_email, friend_email } = req.body;
  if (!user_email || !friend_email)
    return res.status(400).json({ success: false, error: "Missing emails" });

  try {
    const db = await openDB();
    const userId = await getUserIdByEmail(db, user_email);
    const friendId = await getUserIdByEmail(db, friend_email);

    if (!userId || !friendId)
      return res.status(404).json({ success: false, error: "User not found" });

    if (userId === friendId)
      return res.status(400).json({ success: false, error: "Cannot add yourself" });

    const exists = await db.get(
      `SELECT * FROM contact WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`,
      [userId, friendId, friendId, userId]
    );

    if (exists)
      return res.json({ success: false, message: "Already friends" });

    await db.run(`INSERT INTO contact (user1_id, user2_id) VALUES (?, ?)`, [
      userId,
      friendId,
    ]);

    res.json({ success: true, message: "Friend added successfully" });
  } catch (err) {
    console.error("❌ Error adding friend:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

/* ===========================
   🧩 4️⃣ JOIN COMMUNITY
=========================== */
router.post("/join-community", async (req, res) => {
  const { community_id, user_email, role } = req.body;

  if (!community_id || !user_email)
    return res.status(400).json({ success: false, error: "Missing fields" });

  try {
    const db = await openDB();
    const userId = await getUserIdByEmail(db, user_email);
    if (!userId) return res.status(404).json({ success: false, error: "User not found" });

    const existing = await db.get(
      `SELECT * FROM community_members WHERE community_id = ? AND user_id = ?`,
      [community_id, userId]
    );

    if (existing)
      return res.json({ success: false, message: "Already joined this community" });

    await db.run(
      `INSERT INTO community_members (community_id, user_id, role) VALUES (?, ?, ?)`,
      [community_id, userId, role || "member"]
    );

    res.json({ success: true, message: "Joined community successfully" });
  } catch (err) {
    console.error("❌ Error joining community:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

/* ===========================
   🚫 5️⃣ BLOCK USER
=========================== */
router.post("/block", async (req, res) => {
  const { user_email, victim_email } = req.body;

  if (!user_email || !victim_email)
    return res.status(400).json({ success: false, error: "Missing emails" });

  try {
    const db = await openDB();
    const userId = await getUserIdByEmail(db, user_email);
    const victimId = await getUserIdByEmail(db, victim_email);

    if (!userId || !victimId)
      return res.status(404).json({ success: false, error: "User not found" });

    if (userId === victimId)
      return res.status(400).json({ success: false, error: "Cannot block yourself" });

    const alreadyBlocked = await db.get(
      `SELECT * FROM blocked WHERE user_id = ? AND victim_id = ?`,
      [userId, victimId]
    );

    if (alreadyBlocked)
      return res.json({ success: false, message: "User already blocked" });

    await db.run(`INSERT INTO blocked (user_id, victim_id) VALUES (?, ?)`, [
      userId,
      victimId,
    ]);

    res.json({ success: true, message: "User blocked successfully" });
  } catch (err) {
    console.error("❌ Error blocking user:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

/* ===========================
   💔 6️⃣ REMOVE FRIEND
=========================== */
router.post("/remove-friend", async (req, res) => {
  const { user_email, friend_email } = req.body;

  if (!user_email || !friend_email)
    return res.status(400).json({ success: false, error: "Missing emails" });

  try {
    const db = await openDB();
    const userId = await getUserIdByEmail(db, user_email);
    const friendId = await getUserIdByEmail(db, friend_email);

    if (!userId || !friendId)
      return res.status(404).json({ success: false, error: "User not found" });

    const existing = await db.get(
      `SELECT * FROM contact WHERE 
        (user1_id = ? AND user2_id = ?) 
        OR (user1_id = ? AND user2_id = ?)`,
      [userId, friendId, friendId, userId]
    );

    if (!existing)
      return res.json({ success: false, message: "Not friends" });

    await db.run(
      `DELETE FROM contact WHERE 
        (user1_id = ? AND user2_id = ?) 
        OR (user1_id = ? AND user2_id = ?)`,
      [userId, friendId, friendId, userId]
    );

    res.json({ success: true, message: "Friend removed successfully" });
  } catch (err) {
    console.error("❌ Error removing friend:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

/* ===========================
   🚪 7️⃣ LEAVE COMMUNITY
=========================== */
router.post("/leave-community", async (req, res) => {
  const { community_id, user_email } = req.body;

  if (!community_id || !user_email)
    return res.status(400).json({ success: false, error: "Missing fields" });

  try {
    const db = await openDB();
    const userId = await getUserIdByEmail(db, user_email);
    if (!userId) return res.status(404).json({ success: false, error: "User not found" });

    const member = await db.get(
      `SELECT * FROM community_members WHERE community_id = ? AND user_id = ?`,
      [community_id, userId]
    );

    if (!member)
      return res.json({
        success: false,
        message: "Not part of this community",
      });

    await db.run(
      `DELETE FROM community_members WHERE community_id = ? AND user_id = ?`,
      [community_id, userId]
    );

    res.json({ success: true, message: "Left community successfully" });
  } catch (err) {
    console.error("❌ Error leaving community:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

/* ===========================
   🔍 8️⃣ SEARCH USERS
=========================== */
router.get("/search", async (req, res) => {

  const { query } = req.query;

  if (!query || query.trim() === "")
    return res.status(400).json({ success: false, error: "Search query required" });

  try {
    const db = await openDB();
    const users = await db.all(
      `
      SELECT id, name, nickname, email, phone, theme, created_at
      FROM user
      WHERE 
        name LIKE ? 
        OR nickname LIKE ? 
        OR email LIKE ? 
        OR phone LIKE ?
      LIMIT 20;
      `,
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    );

    res.json({ success: true, users });
  } catch (err) {
    console.error("❌ Error searching users:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

export default router;
