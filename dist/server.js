"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const initialize_1 = require("./db/initialize");
const auth0_1 = require("./middleware/auth0"); // This import makes the declaration visible
const userHandler_1 = require("./middleware/userHandler");
const errorHandler_1 = require("./middleware/errorHandler");
const voiceEntryRoutes_1 = __importDefault(require("./routes/voiceEntryRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
async function startServer() {
    await (0, initialize_1.initializeDatabase)();
    app.use(express_1.default.json()); // Make sure this is before route definitions
    app.get("/", (req, res) => {
        res.send("Welcome to the Voice Journal API!");
    });
    // All routes under /api/voice-entries now require authentication
    // and user handling middleware
    app.use("/api/voice-entries", auth0_1.checkJwt, userHandler_1.userHandler, voiceEntryRoutes_1.default);
    // Example of a protected public endpoint
    app.get("/api/protected", auth0_1.checkJwt, (req, res) => {
        res.json({
            message: "Hello from a protected endpoint!",
            userAuthPayload: req.auth?.payload,
        });
    });
    app.use(errorHandler_1.errorHandler);
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}
startServer();
