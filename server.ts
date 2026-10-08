import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fetchMapsGroundedClinics, transcribeAudio } from './server/api';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API route for Maps Grounding with gemini-3.5-flash
app.post('/api/maps-grounding', async (req, res) => {
  try {
    const location = req.body.location || 'San Francisco, CA';
    const complaint = req.body.complaint || '';
    const data = await fetchMapsGroundedClinics(location, complaint);
    res.json(data);
  } catch (error: any) {
    console.error('Maps Grounding Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API route for Audio Transcription with gemini-3.5-transcribe
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audio, mimeType } = req.body;
    if (!audio) {
      return res.status(400).json({ error: 'Missing audio base64 payload' });
    }
    const data = await transcribeAudio(audio, mimeType);
    res.json(data);
  } catch (error: any) {
    console.error('Transcription Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend dist files in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Clinical Vitality server running on port ${port}`);
});
