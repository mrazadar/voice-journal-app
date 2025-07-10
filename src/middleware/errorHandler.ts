import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { HttpError } from "../errors/customErrors";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: err.errors,
    });
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof UnauthorizedError) {
    res.status(401).json({ message: `Unauthorized: ${err.message}` });
  }

  // Generic error for unexpected issues
  res.status(500).json({ message: "Something went wrong!" });
};
