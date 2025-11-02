import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import envRouter from "./routes/env.js";
import callsRouter from "./routes/calls.js";
import calendarRouter from "./routes/calendar.js";
import AuthenticationRouter from "./routes/auth.js";
import messagesRoutes from './routes/messages.js';
import UserRoutes from './routes/UserRoutes.js'
import ActivityRouter from "./routes/activity.js";
import { initSocketHandlers } from "./socket/handlers.js";
import { initCallSignaling } from "./socket/callSignaling.js";
import { config } from "./config/config.js";


import { logActivity } from "./middleware/activityLogger.js";


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(logActivity);


// Routes
app.get("/", (req, res) => {
  res.json({
    message: "TeamsClone-RL Backend API",
    version: "1.0.0",
    endpoints: {
      env: "/env/*",
      calls: "/calls/*",
      calendar: "/calendar/*",
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


app.use("/activity", ActivityRouter);


// Initialize Socket.IO handlers
initSocketHandlers(io);
initCallSignaling(io);

// Start server
httpServer.listen(config.port, () => {
  console.log(`🚀 TeamsClone-RL Backend running on port ${config.port}`);
  console.log(`📡 Socket.IO enabled`);
  console.log(`🤖 RL Environment API: http://localhost:${config.port}/env`);
  console.log(`📞 Call Management API: http://localhost:${config.port}/calls`);
  console.log(`📅 Calendar API: http://localhost:${config.port}/calendar`);
});

export { io };
