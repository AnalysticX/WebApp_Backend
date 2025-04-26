import express from 'express';
import { createTranscript, deleteTranscript, findFilteredTranscript, findSingleTranscript, getAllTranscripts } from '../../controllers/dashboard/transcript.js';

const router = express.Router()

//Route to get all transcripts
router.get('/transcript/all',getAllTranscripts)
//Route to get transcripts filtered by user
router.get('/transcript/filter',findFilteredTranscript)
//Route to get single transcript detail
router.get('/transcript/:id',findSingleTranscript)
//Route to create a transcript
router.post('/transcript/new',createTranscript)
//Route to delete a transcript 
router.delete('/transcript/:id',deleteTranscript)

export default router;