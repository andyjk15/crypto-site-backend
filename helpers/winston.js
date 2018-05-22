var appRoot = require('app-root-path');
var winston = require('winston');

var options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    humanReadableUnhandledException: true

  }
};

// Instantiate new Logger
var logger = new winston.Logger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // Do not exit on handled Exceptions
});

// Morgan Stream
logger.stream = {
  write: function (message) { // encoding
    logger.error(message);
  }
};

module.exports = logger;
