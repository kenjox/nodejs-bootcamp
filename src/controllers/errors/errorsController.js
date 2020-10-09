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
    console.error(`Error 💥: ${err}`);

    //Send generic error
    res.status(500).json({
      status: err.status,
      message: 'Whoooops something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorToDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    sendErrorToProd(err, res);
  }

  next();
};
