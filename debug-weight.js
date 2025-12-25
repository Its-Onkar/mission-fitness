// Simple debug script to test weight logging
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MONGO_URI } from './src/config/variables.js';
import weightRouter from './src/routers/weight.route.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Debug middleware
app.use('/api/weight', (req, res, next) => {
  console.log('🔍 Weight API Request:');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('User:', req.user);
  next();
});

// Use weight router
app.use('/api/weight', weightRouter);

// Test endpoint
app.post('/api/test-weight', async (req, res) => {
  try {
    console.log('🧪 Test weight endpoint called');
    console.log('Body:', req.body);
    
    res.json({
      success: true,
      message: 'Test endpoint working',
      receivedData: req.body
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Debug server running on port ${PORT}`);
  console.log(`Test the weight endpoint at: http://localhost:${PORT}/api/weight/log`);
});