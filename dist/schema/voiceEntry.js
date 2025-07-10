"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVoiceEntrySchema = exports.CreateVoiceEntrySchema = void 0;
const zod_1 = require("zod");
exports.CreateVoiceEntrySchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().optional(),
    // audio: z.string().min(1, "Audio is required"),
});
exports.UpdateVoiceEntrySchema = exports.CreateVoiceEntrySchema.merge(
// this will inherit title etc from the CreateVoiceEntrySchema
zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").optional(),
}));
