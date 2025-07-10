"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVoiceEntry = exports.updateVoiceEntry = exports.getVoiceEntryById = exports.getVoiceEntries = exports.createVoiceEntry = void 0;
const db_1 = __importDefault(require("../config/db"));
const voiceEntry_1 = require("../schemas/voiceEntry");
const pg_large_object_1 = require("pg-large-object");
const customErrors_1 = require("../errors/customErrors");
// Helper to get Large Object Manager within a transaction
async function withLargeObjectManager(callback) {
    const client = await db_1.default.connect();
    try {
        await client.query("BEGIN");
        const man = new pg_large_object_1.LargeObjectManager({ pg: client });
        const result = await callback(man, client);
        await client.query("COMMIT");
        return result;
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
}
const createVoiceEntry = async (req, res, next) => {
    // In this initial version, we won't handle the audio upload yet.
    // We'll simulate creating an entry without an actual audio file,
    // and update it in Day 2.
    // For now, audio_oid will be a placeholder (e.g., 0 or a temp value).
    try {
        const { title, description } = voiceEntry_1.CreateVoiceEntrySchema.parse(req.body);
        const userId = req.user.id; // Placeholder: Replace with actual user ID from Auth0 later
        const result = await db_1.default.query("INSERT INTO voice_entries (user_id, title, description, audio_oid) VALUES ($1, $2, $3, $4) RETURNING *", [userId, title, description, 0] // Placeholder audio_oid
        );
        res.status(201).json({
            message: "Voice entry created (audio placeholder)",
            entry: result.rows[0],
        });
    }
    catch (error) {
        next(error); // Pass error to error handling middleware
    }
};
exports.createVoiceEntry = createVoiceEntry;
const getVoiceEntries = async (req, res, next) => {
    try {
        const userId = req.user.id; // Placeholder
        const result = await db_1.default.query("SELECT * FROM voice_entries WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        next(error); // Pass error to error handling middleware
    }
};
exports.getVoiceEntries = getVoiceEntries;
const getVoiceEntryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // Placeholder
        const result = await db_1.default.query("SELECT * FROM voice_entries WHERE id = $1 AND user_id = $2", [id, userId]);
        if (result.rows.length === 0) {
            throw new customErrors_1.NotFoundError("Voice entry not found or unauthorized");
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        next(error); // Pass error to error handling middleware
    }
};
exports.getVoiceEntryById = getVoiceEntryById;
const updateVoiceEntry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // Placeholder
        const { title, description } = voiceEntry_1.UpdateVoiceEntrySchema.parse(req.body);
        const result = await db_1.default.query("UPDATE voice_entries SET title = COALESCE($1, title), description = COALESCE($2, description) WHERE id = $3 AND user_id = $4 RETURNING *", [title, description, id, userId]);
        if (result.rows.length === 0) {
            throw new customErrors_1.NotFoundError("Voice entry not found or unauthorized");
        }
        res
            .status(200)
            .json({ message: "Voice entry updated", entry: result.rows[0] });
    }
    catch (error) {
        next(error); // Pass error to error handling middleware
    }
};
exports.updateVoiceEntry = updateVoiceEntry;
const deleteVoiceEntry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // Placeholder
        // First, get the audio_oid to delete the large object
        const entryResult = await db_1.default.query("SELECT audio_oid FROM voice_entries WHERE id = $1 AND user_id = $2", [id, userId]);
        if (entryResult.rows.length === 0) {
            throw new customErrors_1.NotFoundError("Voice entry not found or unauthorized");
        }
        const audioOid = entryResult.rows[0].audio_oid;
        // Delete the entry from the table
        const deleteResult = await db_1.default.query("DELETE FROM voice_entries WHERE id = $1 AND user_id = $2 RETURNING *", [id, userId]);
        if (deleteResult.rows.length === 0) {
            throw new customErrors_1.NotFoundError("Voice entry not found or unauthorized");
        }
        // Delete the large object (if it's not a placeholder 0)
        if (audioOid !== 0) {
            await withLargeObjectManager(async (man) => {
                await man.unlinkAsync(audioOid);
                console.log(`Large object with OID ${audioOid} deleted.`);
            });
        }
        res.status(204).send(); // No Content
    }
    catch (error) {
        next(error); // Pass error to error handling middleware
    }
};
exports.deleteVoiceEntry = deleteVoiceEntry;
