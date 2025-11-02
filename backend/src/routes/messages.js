import express from "express";
import openDB from "../models/database.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 Apply authentication middleware globally
// router.use(verifyToken);

/** Helper function to get user ID by email */
async function getUserIdByEmail(db, email) {
  const user = await db.get("SELECT id FROM user WHERE email = ?", [email]);
  return user ? user.id : null;
}

/* ===========================
   💬 POST /api/messages → Send a message
=========================== */
router.post("/", async (req, res) => {
  console.log("📩 Sending message...");

  const { sender_email, receiver_email, message } = req.body;

  if (!sender_email || !receiver_email || !message)
    return res.status(400).json({ success: false, error: "Missing required fields" });

  try {
    const db = await openDB();

    const senderId = await getUserIdByEmail(db, sender_email);
    const receiverId = await getUserIdByEmail(db, receiver_email);

    if (!senderId || !receiverId)
      return res.status(404).json({ success: false, error: "User not found" });

    await db.run(
      `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`,
      [senderId, receiverId, message]
    );

    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("❌ Database error while sending message:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

/* ===========================
   💬 GET /api/messages/:senderEmail/:receiverEmail → Fetch conversation
=========================== */
router.get("/:senderEmail/:receiverEmail", async (req, res) => {
  const { senderEmail, receiverEmail } = req.params;

  try {
    const db = await openDB();

    const senderId = await getUserIdByEmail(db, senderEmail);
    const receiverId = await getUserIdByEmail(db, receiverEmail);

    if (!senderId || !receiverId)
      return res.status(404).json({ success: false, error: "User not found" });

    const messages = await db.all(
      `
      SELECT 
        m.id,
        s.email AS sender_email,
        r.email AS receiver_email,
        m.message,
        m.timestamp,
        m.is_read
      FROM messages m
      JOIN user s ON m.sender_id = s.id
      JOIN user r ON m.receiver_id = r.id
      WHERE 
        (m.sender_id = ? AND m.receiver_id = ?)
        OR 
        (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.timestamp ASC;
      `,
      [senderId, receiverId, receiverId, senderId]
    );

    console.log(messages);

    res.json({ success: true, messages });
  } catch (err) {
    console.error("❌ Database error while fetching messages:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

/* ===========================
   ✅ PATCH /api/messages/mark-read → Mark messages as read
=========================== */
router.patch("/mark-read", async (req, res) => {
  const { sender_email, receiver_email } = req.body;

  if (!sender_email || !receiver_email)
    return res.status(400).json({ success: false, error: "Missing required fields" });

  try {
    const db = await openDB();

    const senderId = await getUserIdByEmail(db, sender_email);
    const receiverId = await getUserIdByEmail(db, receiver_email);

    if (!senderId || !receiverId)
      return res.status(404).json({ success: false, error: "User not found" });

    await db.run(
      `
      UPDATE messages
      SET is_read = 1
      WHERE sender_id = ? AND receiver_id = ?;
      `,
      [senderId, receiverId]
    );

    res.json({ success: true, message: "Messages marked as read" });
  } catch (err) {
    console.error("❌ Database error while marking messages as read:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

export default router;
