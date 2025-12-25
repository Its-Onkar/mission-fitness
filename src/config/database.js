import mongoose from 'mongoose';
import { MONGO_URI } from './variables.js';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    };

    const conn = await mongoose.connect(MONGO_URI, options);
    
    logger.success(`MongoDB Connected: ${conn.connection.host}`, {
      database: conn.connection.name,
      port: conn.connection.port
    });

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        logger.error('Error during MongoDB shutdown:', { error: err.message });
        process.exit(1);
      }
    });

  } catch (error) {
    logger.error('MongoDB connection failed:', { error: error.message });
    process.exit(1);
  }
};

export default connectDB;
