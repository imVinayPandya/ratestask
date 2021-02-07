const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const config = require('config');
const helmet = require('helmet');
const requestIp = require('request-ip');
const compression = require('compression');
const createHttpError = require('http-errors');

const logger = require('./utils/logger');
const route = require('./route');

const app = express();

/**
 * morgan setup for request id
 * ref: https://gist.github.com/cgmartin/913bb12097ff07132597
 */
app.use((req, _res, next) => {
  req.id = uuid.v4();
  next();
});
app.use(compression());
app.use(helmet());

morgan.token('id', req => req.id);
morgan.token('ip', req => requestIp.getClientIp(req));

app.use(morgan(config.morganFormat, { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// application routes
app.use('/', route);

// 404 route
app.all('/*', req => {
  throw createHttpError(404, `Cannot ${req.method.toUpperCase()} ${req.path}`);
});

// handle unknown errors here
app.use((err, req, res, _next) => {
  const errorResponse = {
    error: true,
    message: 'Unknown Error',
    statusCode: 500
  };

  // create a message to log to the console
  const consoleMessage = {
    req: `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`,
    message: 'Unknown Error',
    statusCode: 500
  };

  let message = err && err.message;
  if (!message && typeof err === 'string') {
    message = err;
  }
  if (message) {
    if (err && err.expose !== false && message) {
      errorResponse.message = message;
    }
    consoleMessage.message = message;
  }

  if (err && err.statusCode) {
    errorResponse.statusCode = err.statusCode;
    consoleMessage.statusCode = err.statusCode;
  }

  if (err && err.stack) {
    consoleMessage.stack = err.stack;
    if (config.includeErrorStackTrace) {
      errorResponse.stack = err.stack;
    }
  }

  const keys = ['req', 'statusCode', 'message', 'stack'];
  const formattedConsoleMessage = `Unhandled Error:\n${keys
    .map(key => `  ${key}: ${consoleMessage[key]}`)
    .join('\n')}`;
  logger.error(formattedConsoleMessage);

  return res.status(errorResponse.statusCode).send(errorResponse);
});

module.exports = app;
