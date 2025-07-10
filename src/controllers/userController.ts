// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import { NotFoundError } from "../errors/customErrors";

/**
 * Retrieves the profile of the currently authenticated user from the database.
 * This endpoint is designed for a logged-in user to fetch their own details.
 * The internal user ID is expected to be present on `req.user` due to `userHandler` middleware.
 *
 * @param req Express Request object (with req.user populated by userHandler)
 * @param res Express Response object
 * @param next Express NextFunction for error propagation
 */
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // req.user is guaranteed to exist here because this controller is behind checkJwt and userHandler
    const userId = req.user!.id;

    const result = await pool.query(
      "SELECT id, auth0_id, email, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      // This case should ideally not happen if userHandler correctly created or found the user,
      // but it's a good safeguard.
      throw new NotFoundError("User profile not found in internal database.");
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
};
