// src/server.ts
import app from "./app";
import { config } from "dotenv";
import http from "http";
import {config as appConfig} from "./configs";
config();

const PORT: number = appConfig.app.APP_PORT;
const NODE_ENV: string = appConfig.app.APP_ENV;

const server = new http.Server(app);

// Handle uncaught exceptions and unhandled rejections
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on(
  "unhandledRejection",
  (reason: unknown, promise: Promise<unknown>) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  },
);

// Graceful shutdown
const shutdown = () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Start server
server.listen(PORT, () => {
  console.log(`
   Server running in ${NODE_ENV} mode
   Listening on port ${PORT}
   Ready to handle requests
 `);
});
