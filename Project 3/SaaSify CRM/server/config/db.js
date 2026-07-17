const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    let dbUrl = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/saas_crm';

    // Proactively start MongoMemoryServer in development if using default/localhost DB URL
    if (
      process.env.NODE_ENV === 'development' &&
      (dbUrl.includes('127.0.0.1') || dbUrl.includes('localhost'))
    ) {
      console.log('Starting MongoDB Memory Server for local development...');
      mongod = await MongoMemoryServer.create();
      dbUrl = mongod.getUri();
      console.log(`MongoDB Memory Server started at: ${dbUrl}`);
    }

    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
      console.log('MongoDB Memory Server stopped.');
    }
  } catch (error) {
    console.error(`Error during MongoDB disconnect: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
