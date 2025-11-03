import express from "express";
import openDB from "../models/database.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get recent activities
router.get("/", verifyToken, async (req, res) => {
  try {
    const db = await openDB();
    const activities = await db.all(
      `SELECT * FROM activity WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );
    res.json({ success: true, activities });
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

export default router;
