const AppError = require('./../utils/appError');
const { z } = require('zod');
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // console.log(err.errorResponse.errmsg);
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  //   console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data.  ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleZodValidationError = (err) => {
  const errors = err.errors.map((zodError) => ({
    field: zodError.path.join(''),
    message: zodError.message,
  }));

  return new AppError(
    `Invalid input data. ${errors.map((e) => e.message).join('. ')}`,
    400,
  );
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Clone the error object, preserving all properties
  let error = Object.assign({}, err);
  error.message = err.message;
  error.name = err.name; // Ensure `name` is explicitly copied
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res); // Use the original `err` for full details
  } else if (process.env.NODE_ENV === 'production') {
    if (err instanceof z.ZodError) {
      error = handleZodValidationError(err);
    } else {
      if (err.name === 'CastError') error = handleCastErrorDB(err);
      if (err.code === 11000) error = handleDuplicateFieldsDB(err);
      if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
      if (err.name === 'JsonWebTokenError') error = handleJWTError();
      if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
};
