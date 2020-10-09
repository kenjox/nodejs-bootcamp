const express = require('express');
const morgan = require('morgan');
require('dotenv').config({ path: './config.env' });
const AppErrorHandler = require('./utils/errors-utils');
const errorsController = require('./controllers/errors/errorsController');

const toursRouter = require('./routes/toursRoutes');
const usersRouter = require('./routes/usersRoutes');

const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// Routes
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

// Unhandled routes
app.all('*', (req, res, next) => {
  const msg = 'Could not requested url: ${req.originalUrl}';
  next(new AppErrorHandler(msg));
});

// Error handling middleware
app.use(errorsController);

module.exports = { app };
