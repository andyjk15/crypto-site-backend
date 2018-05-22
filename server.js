var http = require('http');
var app = require('./app/app.js');

// Chalk colour schemes
var colours = require('./helpers/chalk.js');

// Port selection
var port = process.env.PORT || 8080;

// Server creation
var server = http.createServer(app);
server.listen(port);
console.log(colours.warn('Listening on port: ' + port));

// Exports
module.exports.server = server;
module.exports.closeServer = function () {
  server.close();
};
