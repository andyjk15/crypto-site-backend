var chalk = require('chalk');

module.exports.chalk = chalk;

// Chalk colours
module.exports.warn = chalk.bold.yellow;
module.exports.error = chalk.bold.red;
module.exports.info = chalk.bold.green;
module.exports.irrel = chalk.grey;
module.exports.reli = chalk.bold.blue;
module.exports.childname = chalk.magenta;
module.exports.childwrap = chalk.cyan;
module.exports.childPID = chalk.bold.black;
