var express = require('express');
var favicon = require('serve-favicon');
var app = express();
var appRoot = require('app-root-path');
var winston = require(appRoot + '/helpers/winston.js');
var colours = require(appRoot + '/helpers/chalk.js');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');

// Spawn collector child process
var spawn = require('child_process').spawn;
var datacollect = spawn('node', [appRoot + '/app/controllers/collector.js'], {
  detached: true
});
datacollect.stdout.on('data', function (data) {
  var log = data.toString();
  if (log.includes('*Error*')) {
    console.log(colours.childname('Collector Output : ') +
            colours.error(log) +
            colours.childPID(' -- PID : ' + datacollect.pid)
    );
  } else if (log.includes('*Warning*')) {
    console.log(colours.childname('Collector Output : ') +
            colours.warn(log) +
            colours.childPID(' -- PID : ' + datacollect.pid)
    );
  } else {
    console.log(colours.childname('Collector Output : ') +
            colours.info(log) +
            colours.childPID(' -- PID : ' + datacollect.pid)
    );
  }
});
datacollect.stderr.on('data', function (data) {
  console.log(colours.error('Collector Output : ') +
        colours.error('Child Error : ' + data) +
        colours.childPID(' -- PID : ' + datacollect.pid)
  );
});

// Morgan custom formatting
app.use(morgan(function (tokens, req, res) {
  var status = tokens.status(req, res);
  var statusColor = status >= 500
    ? 'red' : status >= 400
      ? 'red' : status >= 400
        ? 'yellow' : status >= 300
          ? 'cyan' : 'green';

  return colours.chalk.reset(padRight(tokens.method(req, res) +
            ' ' + colours.reli(tokens.url(req, res)), 50)) +
        ' ' + colours.chalk.bold[statusColor](status) +
        ' ' + colours.chalk.reset(padLeft(tokens['response-time'](req, res) + ' ms', 8)) +
        ' ' + colours.chalk.reset('-') +
        ' ' + colours.irrel(tokens['remote-addr'](req, res));
}));
function padLeft (str, len) {
  return len > str.length
    ? (new Array(len - str.length + 1)).join(' ') + str
    : str;
}
function padRight (str, len) {
  return len > str.length
    ? str + (new Array(len - str.length + 1)).join(' ')
    : str;
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'anystringoftext',  //CHANGE THIS!!!!
  saveUninitialized: true,
  resave: true
}));
app.use(favicon(__dirname + '/images/favicon.ico'));

// View engine
app.set('view engine', 'pug');  //KILL USE ANGULAR

// Routes
var root = require('../api/routes/root.js');
app.use('/', root);

// Error handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, GET');
    return res.status(200).json({});
  }
  next();
});
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
  winston.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
});
app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(error.status || 404);
  res.send(error.status + '</br>' + error);
});

module.exports = app;
