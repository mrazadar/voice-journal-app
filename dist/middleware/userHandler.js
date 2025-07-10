"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHandler = void 0;
const db_1 = __importDefault(require("../config/db"));
const customErrors_1 = require("../errors/customErrors"); // Assuming you want to use custom errors here too
/**
 * Middleware to handle user presence in the application's database.
 * It expects `req.auth.payload.sub` (Auth0 user ID) to be present from the Auth0 JWT middleware.
 * - If the user (based on auth0_id) exists in our 'users' table, it fetches their internal 'id'.
 * - If the user does not exist, it creates a new user record in the 'users' table.
 * - It then attaches an internal `req.user` object containing the `id`, `auth0Id`, and `email`
 * for subsequent route handlers to use.
 *
 * @param req Express Request object
 * @param res Express Response object
 * @param next Express NextFunction for passing control or errors
 */
const userHandler = async (req, res, next) => {
    const auth0Id = req.auth?.payload.sub;
    const email = req.auth?.payload.email;
    if (!auth0Id) {
        // This should ideally be caught by checkJwt or indicates a misconfiguration
        return next(new customErrors_1.HttpError("Authentication context missing. Auth0 ID not found.", 401));
    }
    let client;
    try {
        client = await db_1.default.connect();
        let userResult = await client.query("SELECT id, auth0_id, email FROM users WHERE auth0_id = $1", [auth0Id]);
        let userId;
        let userEmail = email || `${auth0Id}@placeholder.com`; // Fallback email
        if (userResult.rows.length === 0) {
            console.log(`Creating new internal user for Auth0 ID: ${auth0Id}`);
            const newUserResult = await client.query("INSERT INTO users (auth0_id, email) VALUES ($1, $2) RETURNING id", [auth0Id, userEmail]);
            userId = newUserResult.rows[0].id;
        }
        else {
            userId = userResult.rows[0].id;
            userEmail = userResult.rows[0].email;
        }
        req.user = { id: userId, auth0Id: auth0Id, email: userEmail };
        next(); // Pass control to the next middleware
    }
    catch (error) {
        console.error("Error in userHandler middleware:", error);
        // Cast error to type Error to ensure it's compatible with next()
        next(error); // Pass the original error to the global error handler
    }
    finally {
        if (client) {
            client.release();
        }
    }
};
exports.userHandler = userHandler;
