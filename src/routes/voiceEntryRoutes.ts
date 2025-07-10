import { Router, Request, Response, RequestHandler } from "express";
import {
  createVoiceEntry,
  getVoiceEntries,
  getVoiceEntryById,
  updateVoiceEntry,
  deleteVoiceEntry,
  streamVoiceAudio,
} from "../controllers/voiceEntryController";
import multer from "multer";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("audio"), createVoiceEntry as RequestHandler);
router.get("/", getVoiceEntries as RequestHandler);
router.get("/:id", getVoiceEntryById as RequestHandler);
router.put("/:id", updateVoiceEntry as RequestHandler);
router.delete("/:id", deleteVoiceEntry as RequestHandler);
router.get("/:id/audio", streamVoiceAudio as RequestHandler);

export default router;
