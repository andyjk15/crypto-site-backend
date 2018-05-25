var appRoot = require('app-root-path');
var winston = require('winston'),
    winstonCouch = require('winston-couchdb').Couchdb;

require('dotenv').config({
    path: appRoot + '/config/currencies.env'
});

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

winston.add(winstonCouch, {
    host: 'localhost'
    , port: 5984
    // optional
    , auth: {username: process.env.COUCH_USER, password: process.env.COUCH_PASS}
    , secure: false
    , level: 'info'
});

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
