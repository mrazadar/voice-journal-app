// src/schemas/voiceEntry.ts
import { z } from "zod";

/**
 * Zod schema for validating the payload when creating a new voice entry.
 * - `title`: Must be a string with at least 1 character.
 * - `description`: Optional string.
 */
export const CreateVoiceEntrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

/**
 * Zod schema for validating the payload when updating an existing voice entry.
 * All fields are optional as updates might only change specific properties.
 * - `title`: Optional string with at least 1 character if provided.
 * - `description`: Optional string.
 */
export const UpdateVoiceEntrySchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
});
