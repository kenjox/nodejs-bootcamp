const AppErrorHandler = require('../../utils/errors-utils');

const sendErrorToDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stackTrace: err.stack,
  });
};

const sendErrorToProd = (err, res) => {
  // Trusted error: ie operational errors
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Unknown errors
    //Log using logger..Here we will use console instead
    console.error(`Error 💥:`, JSON.stringify(err, null, 2));

    //Send generic error
    res.status(500).json({
      status: err.status,
      message: 'Whoooops something went wrong!',
    });
  }
};

const badRequestResponse = (msg) => {
  return new AppErrorHandler(msg, 400);
};

// Handles wrong id
const handleCastErrorDB = (err) => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return badRequestResponse(msg);
};

// Handles duplicate field i.e unique field errors code: 11000
const handleDuplicateFieldDB = (err) => {
  const msg = `"${err.keyValue.name}" already exists. Duplicates not allowed`;
  return badRequestResponse(msg);
};

// Handles schema validation errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const msg = `Invalid data. ${errors.join('. ')}`;

  return badRequestResponse(msg);
};

// Handles invalid token
const handleInvalidJWTTokenError = () =>
  new AppErrorHandler(
    'Invalid token provided. Please login to get access',
    401
  );

// Handle expired token
const handleExpiredJWTTokenError = () => new AppErrorHandler('Invali');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorToDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    // Casting error eg string 'asascc' for id instead of mongo id type
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    // Duplicate field where unique is enforced
    if (err.code === 11000) {
      error = handleDuplicateFieldDB(error);
    }

    // Schema ValidationError
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    // Invalid token a.k.a JsonWebTokenError
    if (error.name === 'JsonWebTokenError')
      error = handleInvalidJWTTokenError();

    // EXpired token
    if (error.name === 'TokenExpiredError')
      error = handleExpiredJWTTokenError();

    sendErrorToProd(error, res);
  }

  next();
};
