const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');

const app = express();

// Helmet middleware for setting secure HTTP headers
app.use(helmet());

const allowedOrigins = [
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

// CORS configuration - Allows requests from the Vite development server and configured frontend origins
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Standard parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SaaS CRM Core Services are active.',
  });
});

// Routing Mounts
app.use('/api/auth', authRoutes);
app.use('/api/users', memberRoutes);

// Catch 404 routes and forward to error handler
app.use(notFound);

// Centralized error interceptor
app.use(errorHandler);

module.exports = app;
