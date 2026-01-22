import app from "./app";
import { config } from "./config";

const startServer = async (): Promise<void> => {
  try {
    // Start the server
    app.listen(config.port, () => {
      console.log(`
🚀 Server is running!
📡 Environment: ${config.nodeEnv}
🔗 URL: http://localhost:${config.port}
📚 API: http://localhost:${config.port}/api/v1
❤️  Health: http://localhost:${config.port}/api/v1/health
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

// Start the server
startServer();
