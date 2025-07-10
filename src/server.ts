import express from "express";
import dotenv from "dotenv";
import { initializeDatabase } from "./db/initialize";

import { checkJwt } from "./middleware/auth0"; // This import makes the declaration visible
import { userHandler } from "./middleware/userHandler";
import { errorHandler } from "./middleware/errorHandler";

import userRoutes from "./routes/userRoutes";
import voiceEntryRoutes from "./routes/voiceEntryRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

async function startServer() {
  await initializeDatabase();

  app.use(express.json()); // Make sure this is before route definitions

  app.get("/", (req, res) => {
    res.send("Welcome to the Voice Journal API!");
  });

  // All routes under /api/voice-entries now require authentication
  // and user handling middleware
  app.use("/api/voice-entries", checkJwt, userHandler, voiceEntryRoutes);

  // User Routes <--- NEW: Apply middleware and user routes
  app.use("/api/users", checkJwt, userHandler, userRoutes);

  // app.get("/me", checkJwt, userHandler, userRoutes);

  // Example of a protected public endpoint
  app.get("/api/protected", checkJwt, (req, res) => {
    res.json({
      message: "Hello from a protected endpoint!",
      userAuthPayload: req.auth?.payload,
    });
  });

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
