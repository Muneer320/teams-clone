import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../models/database.js"; // Import the MySQL pool

// Load environment variables (for JWT_SECRET)
dotenv.config();

const router = express.Router();

const JWT_SECRET =
  "a7020ef410d0d6eb1a3dbd840240aef5d325e877b2f8ffb183e2f7a1944990df94dda60a77351f7c05b71e11384ae0e4773d237517486467ad889cb8d7fc2f11";

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  [
    // Validation middleware
    // body("name", "Name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    console.log("SIGN UP REQ");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body
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

    let connection;
    try {
      // Get a connection from the pool
      connection = await pool.getConnection();

      // 1. Check if user already exists
      const [existingUsers] = await connection.query(
        "SELECT * FROM `user` WHERE `email` = ?",
        [email]
      );

      if (existingUsers.length > 0) {
        return res
          .status(400)
          .json({ msg: "User already exists with this email" });
      }

      // 2. Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 3. Insert new user into the database
      // We'll only insert the fields provided, letting others use defaults from the schema
      const newUser = {
        name,
        email,
        password: hashedPassword,
        nickname: nickname || null,
        phone: phone || null,
        theme: theme || "default",
        whoCanAddToGroup: whoCanAddToGroup || "everyone",
        whoCanCall: whoCanCall || "everyone",
        read_receipt: read_receipt !== undefined ? read_receipt : true,
      };

      const [result] = await connection.query(
        "INSERT INTO `user` SET ?",
        newUser
      );

      const insertedUserId = result.insertId;

      // 4. Create and return JWT
      const payload = {
        user: {
          id: insertedUserId,
          email: email,
        },
      };

      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: "5h" }, // Token expires in 5 hours (good for a hackathon)
        (err, token) => {
          if (err) throw err;
          res.json({ token, msg: "User registered successfully" });
        }
      );
    } catch (err) {
      console.error("Error in /register route:", err.message);
      res.status(500).send("Server error");
    } finally {
      // 5. Release the connection back to the pool
      if (connection) {
        connection.release();
      }
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user (login) and get token
 * @access  Public
 */
router.post(
  "/login",
  [
    // Validation middleware
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    console.log("SIGN IN REQ");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    let connection;
    try {
      // Get a connection from the pool
      connection = await pool.getConnection();

      // 1. Check if user exists
      const [users] = await connection.query(
        "SELECT * FROM `user` WHERE `email` = ?",
        [email]
      );

      if (users.length === 0) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const user = users[0];

      // 2. Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // 3. Create and return JWT
      const payload = {
        user: {
          id: user.id,
          email: user.email,
        },
      };

      jwt.sign(payload, JWT_SECRET, { expiresIn: "5h" }, (err, token) => {
        if (err) throw err;
        res.json({ token, msg: "Login successful" });
      });
    } catch (err) {
      console.error("Error in /login route:", err.message);
      res.status(500).send("Server error");
    } finally {
      // 4. Release the connection back to the pool
      if (connection) {
        connection.release();
      }
    }
  }
);

export default router;
