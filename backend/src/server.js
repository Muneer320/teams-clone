import express from "express";
import { createServer } from "http";
import cors from "cors";
import envRouter from "./routes/env.js";
import callsRouter from "./routes/calls.js";
import calendarRouter from "./routes/calendar.js";
import AuthenticationRouter from "./routes/auth.js";
import messagesRoutes from './routes/messages.js';
import activityRouter from './routes/activity.js';
import UserRoutes from './routes/UserRoutes.js'
import { config } from "./config/config.js";
import { databaseReady } from "./models/database.js";

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "TeamsClone task simulator API",
    version: "1.0.0",
    endpoints: {
      env: "/env/*",
      calls: "/calls/*",
      messages: "/api/messages/*",
      health: "/health",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// RL Environment API routes
app.use("/env", envRouter);

// Call Management API routes
app.use("/calls", callsRouter);

// Calendar API routes
app.use("/auth", AuthenticationRouter);

// User API routes
app.use("/user", UserRoutes);

// Calendar API routes
app.use("/calendar", calendarRouter);


// Calendar API routes
app.use("/api/messages", messagesRoutes);
app.use("/activity", activityRouter);

// Start server
await databaseReady;
httpServer.listen(config.port, () => {
  console.log(`🚀 TeamsClone-RL Backend running on port ${config.port}`);
  console.log(`🤖 Task environment API: http://localhost:${config.port}/env`);
  console.log(`📞 Call Management API: http://localhost:${config.port}/calls`);
  console.log(`📅 Calendar API: http://localhost:${config.port}/calendar`);
});
