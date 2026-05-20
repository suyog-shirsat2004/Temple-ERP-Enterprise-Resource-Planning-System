const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

let mongoServer;

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/temple_erp';
    await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.log('Primary connection failed, starting local MongoDB server...');
    try {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`MongoDB Connected (Local Memory Server): ${uri}`);
    } catch (memoryError) {
      console.error('MongoDB connection error:', memoryError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
