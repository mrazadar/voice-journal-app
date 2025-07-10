"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVoiceEntrySchema = exports.CreateVoiceEntrySchema = void 0;
// src/schemas/voiceEntry.ts
const zod_1 = require("zod");
/**
 * Zod schema for validating the payload when creating a new voice entry.
 * - `title`: Must be a string with at least 1 character.
 * - `description`: Optional string.
 */
exports.CreateVoiceEntrySchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().optional(),
});
/**
 * Zod schema for validating the payload when updating an existing voice entry.
 * All fields are optional as updates might only change specific properties.
 * - `title`: Optional string with at least 1 character if provided.
 * - `description`: Optional string.
 */
exports.UpdateVoiceEntrySchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").optional(),
    description: zod_1.z.string().optional(),
});
