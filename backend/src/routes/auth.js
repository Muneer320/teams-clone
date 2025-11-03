import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { JWT_SECRET } from "../config/auth.js";
import openDB from "../models/database.js"; // ✅ your file exports openDB() function

dotenv.config();

const router = express.Router();


/* ===============================
   🧩 REGISTER NEW USER
=============================== */
router.post(
  "/register",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    console.log("📥 SIGN UP REQUEST RECEIVED");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      password,
      nickname,
      phone,
      theme,
      whoCanAddToGroup,
      whoCanCall,
      read_receipt,
    } = req.body;

    try {
      const db = await openDB(); // ✅ FIX: call function, not promise

      // 1️⃣ Check if user already exists
      const existingUser = await db.get("SELECT * FROM user WHERE email = ?", [
        email,
      ]);

      if (existingUser) {
        return res
          .status(400)
          .json({ msg: "User already exists with this email" });
      }

      // 2️⃣ Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 3️⃣ Insert new user
      const result = await db.run(
        `INSERT INTO user 
          (name, email, password, nickname, phone, theme, whoCanAddToGroup, whoCanCall, read_receipt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name || null,
          email,
          hashedPassword,
          nickname || null,
          phone || null,
          theme || "default",
          whoCanAddToGroup || "everyone",
          whoCanCall || "everyone",
          read_receipt !== undefined ? read_receipt : 1,
        ]
      );

      const userId = result.lastID;

      // 4️⃣ Create JWT
      const payload = { user: { id: userId, email } };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "5h" });

      res.json({ token, email, msg: "User registered successfully" });
    } catch (err) {
      console.error("❌ Error in /register route:", err.message);
      res.status(500).send("Server error");
    }
  }
);

/* ===============================
   🧩 LOGIN EXISTING USER
=============================== */
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    console.log("📥 SIGN IN REQUEST RECEIVED");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const db = await openDB(); // ✅ FIX here too

      // 1️⃣ Check if user exists
      const user = await db.get("SELECT * FROM user WHERE email = ?", [email]);

      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // 2️⃣ Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // 3️⃣ Create JWT
      const payload = { user: { id: user.id, email: user.email } };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "5h" });

      res.json({ token, email, msg: "Login successful" });
    } catch (err) {
      console.error("❌ Error in /login route:", err.message);
      res.status(500).send("Server error");
    }
  }
);

export default router;
