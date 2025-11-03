import express from "express";
import openDB from "../models/database.js";

const router = express.Router();

// Get recent activities
router.get("/", async (req, res) => {
  try {
    const db = await openDB();
    const activities = await db.all(
      `SELECT * FROM activity ORDER BY created_at DESC LIMIT 50`
    );
    res.json({ success: true, activities });
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

export default router;
