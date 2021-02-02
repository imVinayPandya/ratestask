const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const logger = require('./utils/logger');
const route = require('./route');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// application routes
app.use('/', route);

// 404 route
app.use('*', (req, res, next) => {
  res.status(404).send('404 Not Found');
  next();
});

// handle unknown errors here
app.use((error, _req, res, _next) => {
  logger.error(error);
  return res.status(500).send({ message: 'Internal ServerError' });
});

module.exports = app;
