import jwt from "jsonwebtoken";
import openDB from "../models/database.js";
import { JWT_SECRET } from "../config/auth.js";

export const verifyToken = async (req, res, next) => {
  try {
    // 1️⃣ Get token from header (sent as Authorization: Bearer <token>)
    const authHeader = req.headers.authorization;
    // console.log(req.headers.authorization)
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // console.log(decoded)

    // 3️⃣ Fetch user from DB to ensure still valid
    const db = await openDB();
    const user = await db.get(`SELECT * FROM user WHERE email = ?`, [decoded.user.email]);
    if (!user) return res.status(401).json({ error: "User not found or unauthorized" });

    // 4️⃣ Attach user info to request
    req.user = user;

    // 5️⃣ Continue to next route
    next();
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(401).json({ error: "Unauthorized or invalid token" });
  }
};
