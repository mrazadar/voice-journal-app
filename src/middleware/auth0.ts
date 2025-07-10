import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";

dotenv.config();

export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

// Extend the Request type to include Auth0 user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        // Custom user object for our application
        id: number; // Our internal user ID from the database
        auth0Id: string;
        email: string;
      };
    }
  }
}
