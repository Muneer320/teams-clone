export const config = {
  port: process.env.PORT || 3001,
  corsOrigin: (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",").map((origin) => origin.trim()).filter(Boolean),
  nodeEnv: process.env.NODE_ENV || "development",
};
