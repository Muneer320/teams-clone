import jwt from "jsonwebtoken";
import openDB from "../models/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "a7020ef410d0d6eb1a3dbd840240aef5d325e877b2f8ffb183e2f7a1944990df94dda60a77351f7c05b71e11384ae0e4773d237517486467ad889cb8d7fc2f11"; // use your .env secret

export const verifyToken = async (req, res, next) => {
  console.log("Auth catched!")
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
    console.log("Auth Passed!")
    next();
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(401).json({ error: "Unauthorized or invalid token" });
  }
};
