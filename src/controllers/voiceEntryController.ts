import { Request, Response, NextFunction } from "express";
import pool from "../config/db";

import {
  CreateVoiceEntrySchema,
  UpdateVoiceEntrySchema,
} from "../schemas/voiceEntry";
import { LargeObjectManager } from "pg-large-object";
import { BadRequestError, NotFoundError } from "../errors/customErrors";

import { PassThrough } from "stream";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

// Helper to get Large Object Manager within a transaction
async function withLargeObjectManager<T>(
  callback: (man: LargeObjectManager, client: any) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const man = new LargeObjectManager({ pg: client });
    const result = await callback(man, client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export const createVoiceEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // In this initial version, we won't handle the audio upload yet.
  // We'll simulate creating an entry without an actual audio file,
  // and update it in Day 2.
  // For now, audio_oid will be a placeholder (e.g., 0 or a temp value).

  try {
    const { title, description } = CreateVoiceEntrySchema.parse(req.body);
    const userId = req.user!.id; // Placeholder: Replace with actual user ID from Auth0 later

    const file = req.file;

    if (!file) {
      throw new BadRequestError("No media file provided.");
    }

    /**
     * OID: is a type of string that represents a file path or large object
     * Create a new Large Object (OID) and write the file contents to it.
     * This is a helper function that uses the Large Object Manager to create a new OID
     * and write the file contents to it.
     *
     * Where does it store the file?
     *
     * The file is stored in the database, but it's not stored in the file system.
     * Instead, it's stored in the database as a large object.
     * This is because the file is too large to be stored in the file system.
     *
     * How can I view it in database viewer?
     *
     * I can use the Large Object Manager to open the file and read it.
     * The Large Object Manager provides a way to read the file as a stream.
     * We can use the stream to read the file and send it to the client.
     *
     */
    const audioOid = await withLargeObjectManager(async (man) => {
      const bufferStream = new PassThrough();
      bufferStream.end(file.buffer);

      const [oid, writeStream] = await man.createAndWritableStreamAsync();
      bufferStream.pipe(writeStream);

      return new Promise<number>((resolve, reject) => {
        writeStream.on("finish", () => {
          resolve(oid);
        });
        writeStream.on("error", (err) => {
          reject(err);
        });
      });
    });

    const result = await pool.query(
      "INSERT INTO voice_entries (user_id, title, description, audio_oid) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, title, description, audioOid] // Placeholder audio_oid
    );

    res.status(201).json({
      message: "Voice entry created (audio placeholder)",
      entry: result.rows[0],
    });
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

// ... (Your streamVoiceAudio function should be here) ...

// Also, update streamVoiceAudio to use custom errors for consistency
export const streamVoiceAudio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Added next: NextFunction
  try {
    const { id } = req.params;
    const userId = req.user!.id; // Use req.user!.id

    const entryResult = await pool.query(
      "SELECT audio_oid FROM voice_entries WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (entryResult.rows.length === 0) {
      throw new NotFoundError("Audio not found or unauthorized."); // Use custom error
    }

    const audioOid = entryResult.rows[0].audio_oid;

    // CRITICAL CHECK: Ensure audioOid is not 0 here!
    if (audioOid === 0) {
      throw new BadRequestError("No audio associated with this entry."); // Use custom error
    }

    await withLargeObjectManager(async (man) => {
      const [size, readStream] = await man.openAndReadableStreamAsync(audioOid);

      res.writeHead(200, {
        "Content-Type": "audio/mpeg",
        "Content-Length": size,
        "Accept-Ranges": "bytes",
      });

      readStream.pipe(res);

      readStream.on("error", (err) => {
        console.error("Error streaming audio:", err);
        next(err); // Pass streaming errors to global handler
      });

      req.on("close", () => {
        if (!res.writableEnded) {
          // Only destroy if response hasn't finished
          readStream.destroy();
          console.log("Client disconnected during audio stream.");
        }
      });
    });
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
};

/**
 * Retrieves all voice entries for the currently authenticated user.
 * This endpoint is designed for a logged-in user to fetch their own details.
 * The internal user ID is expected to be present on `req.user` due to `userHandler` middleware.
 */
export const getVoiceEntries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id; // Placeholder
    const result = await pool.query(
      "SELECT * FROM voice_entries WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

export const getVoiceEntryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id; // Placeholder

    const result = await pool.query(
      "SELECT * FROM voice_entries WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError("Voice entry not found or unauthorized");
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

export const updateVoiceEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id; // Placeholder
    const { title, description } = UpdateVoiceEntrySchema.parse(req.body);

    const result = await pool.query(
      "UPDATE voice_entries SET title = COALESCE($1, title), description = COALESCE($2, description) WHERE id = $3 AND user_id = $4 RETURNING *",
      [title, description, id, userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError("Voice entry not found or unauthorized");
    }

    res
      .status(200)
      .json({ message: "Voice entry updated", entry: result.rows[0] });
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

export const deleteVoiceEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id; // Placeholder

    // First, get the audio_oid to delete the large object
    const entryResult = await pool.query(
      "SELECT audio_oid FROM voice_entries WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    if (entryResult.rows.length === 0) {
      throw new NotFoundError("Voice entry not found or unauthorized");
    }
    const audioOid = entryResult.rows[0].audio_oid;

    // Delete the entry from the table
    const deleteResult = await pool.query(
      "DELETE FROM voice_entries WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (deleteResult.rows.length === 0) {
      throw new NotFoundError("Voice entry not found or unauthorized");
    }

    // Delete the large object (if it's not a placeholder 0)
    if (audioOid !== 0) {
      await withLargeObjectManager(async (man) => {
        await man.unlinkAsync(audioOid);
        console.log(`Large object with OID ${audioOid} deleted.`);
      });
    }

    res.status(204).send(); // No Content
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};
