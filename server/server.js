import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import resumesRouter from './routes/resumes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume_optima';

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Database connection
console.log('Connecting to MongoDB database at:', MONGODB_URI);
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB database!');
  })
  .catch((err) => {
    console.error('CRITICAL: MongoDB connection failed:', err.message);
    console.log('Make sure MongoDB service is active. Use "sudo systemctl start mongod" if needed.');
  });

// Routes mounting
app.use('/api/auth', authRouter);
app.use('/api/resumes', resumesRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`[API SERVER] Running on: http://localhost:${PORT}`);
  console.log(`[API SERVER] Health check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
