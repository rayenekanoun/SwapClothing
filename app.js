const express = require('express');
const mongoose = require('mongoose');
const xss = require('xss-clean');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Middleware to add request time to req object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Simple route handler
app.get('/api/v1/', (req, res) => {
  console.log('Hello from the middleware 👋');
  res
    .status(200)
    .json({ status: 'success', message: 'Hello from the server side!' });
});

// Export the app
module.exports = app;
