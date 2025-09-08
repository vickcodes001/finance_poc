// creating a mongoose connection file
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('MONGO_URI environment variable is not set');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;