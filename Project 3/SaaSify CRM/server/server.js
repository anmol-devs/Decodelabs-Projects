const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');
const dotenv = require('dotenv');

// Load environment config files
dotenv.config();

// Establish Mongoose Database Connection
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `SaaS CRM Server running in ${
      process.env.NODE_ENV || 'development'
    } mode on port ${PORT}`
  );
});

// Handle unhandled Promise rejections (e.g. lost db connection after boot)
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Promise Rejection: ${err.message}`);
  // Close server and exit process
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

const shutdown = async () => {
  console.log('Shutting down server gracefully...');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
