/**
 * Logger setup
 */
const winston = require('winston');
const config = require('config');

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(
  info => `[${info.timestamp}] [${info.level}]: ${info.message}`
);
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
};

const logger = createLogger({
  levels,
  silent: config.disableLogger,
  format: combine(
    colorize(),
    timestamp({ format: 'MM-DD-YY HH:mm:ss' }),
    logFormat
  ),
  exitOnError: false,
  transports: [
    new transports.Console({
      humanReadableUnhandledException: true,
      level: 'silly'
    })
  ]
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: message => logger.info(message.substring(0, message.lastIndexOf('\n')))
};

module.exports = logger;
