import mongoose, { Connection } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let mongoConnection: Connection | null = null;

interface ConnectOptions {
  maxRetries?: number;
  retryDelay?: number;
}

export const connectDB = async (options: ConnectOptions = {}): Promise<Connection> => {
  const { maxRetries = 5, retryDelay = 3000 } = options;

  if (mongoConnection) {
    console.log('📦 MongoDB connection already established');
    return mongoConnection;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bidtounsi';

  let retries = 0;

  const attemptConnection = async (): Promise<Connection> => {
    try {
      console.log(`🔄 Attempting MongoDB connection (attempt ${retries + 1}/${maxRetries})...`);
      
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      mongoConnection = mongoose.connection;

      // Event listeners
      mongoConnection.on('connected', () => {
        console.log('✅ MongoDB connected successfully');
      });

      mongoConnection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoConnection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
      });

      return mongoConnection;
    } catch (error) {
      retries++;

      if (retries < maxRetries) {
        console.warn(`⏳ Retrying in ${retryDelay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return attemptConnection();
      } else {
        console.error('❌ Failed to connect to MongoDB after maximum retries');
        throw error;
      }
    }
  };

  return attemptConnection();
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoConnection) {
    await mongoose.disconnect();
    mongoConnection = null;
    console.log('🔌 MongoDB disconnected');
  }
};

export const getConnection = (): Connection | null => {
  return mongoConnection;
};