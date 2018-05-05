var express = require('express');
var favicon = require('serve-favicon');
var app = express();

var colours = require('../helpers/chalk.js');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');

app.use(morgan(function(tokens, req, res) {
	var status = tokens.status(req, res);
	var statusColor = status >= 500 ?
		'red' : status >= 400 ?
			'red' : status >= 400 ?
				'yellow' : status >= 300 ?
					'cyan' : 'green';

	return colours.chalk.reset(padRight(tokens.method(req, res) +
            ' ' + colours.reli(tokens.url(req, res)), 50)) +
        ' ' + colours.chalk.bold[statusColor](status) +
        ' ' + colours.chalk.reset(padLeft(tokens['response-time'](req, res) + ' ms', 8)) +
        ' ' + colours.chalk.reset('-') +
        ' ' + colours.irrel(tokens['remote-addr'](req, res));
}));

function padLeft(str, len) {
	return len > str.length ?
		(new Array(len - str.length + 1)).join(' ') + str :
		str;
}

function padRight(str, len) {
	return len > str.length ?
		str + (new Array(len - str.length + 1)).join(' ') :
		str;
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	secret: 'anystringoftext',
	saveUninitialized: true,
	resave: true
}));
app.use(favicon(__dirname + '/images/favicon.ico'));

app.set('view engine', 'ejs');
require('../api/routes/root.js')(app);

module.exports = app;
