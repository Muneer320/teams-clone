import { randomBytes } from "node:crypto";
import "dotenv/config";

// Local demos work without setup. Set JWT_SECRET for tokens that survive a restart.
export const JWT_SECRET = process.env.JWT_SECRET || randomBytes(32).toString("hex");
