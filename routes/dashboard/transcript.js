import express from "express";
import {
  createTranscript,
  deleteTranscript,
  findFilteredTranscript,
  findSingleTranscript,
  getAllTranscripts,
} from "../../controllers/dashboard/transcript.js";
import verifyUser from "../../middlewares/verifyUser.js";

const router = express.Router();

//Route to get all transcripts
router.get("/transcript/all", verifyUser, getAllTranscripts);
//Route to get transcripts filtered by user
router.get("/transcript/filter", verifyUser, findFilteredTranscript);
//Route to get single transcript detail
router.get("/transcript/:id", verifyUser, findSingleTranscript);
//Route to create a transcript
router.post("/transcript/new", verifyUser, createTranscript);
//Route to delete a transcript
router.delete("/transcript/:id", verifyUser, deleteTranscript);

export default router;
