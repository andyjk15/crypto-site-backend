var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var chalk = require('chalk');
//var error = chalk.bold.red;
var warn = chalk.bold.yellow;
//var info = chalk.bold.green;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true
}));

app.set('view engine', 'ejs');
require('./app/routes/default.js')(app);


//Port
app.listen(port);
console.log(warn('Listening on port: ' + port));
