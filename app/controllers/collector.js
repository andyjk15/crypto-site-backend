/* eslint-disable */
var request = require('request');
var async = require("async");
var appRoot = require('app-root-path');
var winston = require(appRoot + '/helpers/winston.js');
var colours = require(appRoot + '/helpers/chalk.js');
//var dataP = require('./datapush');
//var dataC = require('./datacollect');

require('dotenv').config({
    path: appRoot + '/config/currencies.env'
});

var converted = {
    'USD_GBP': '',
    'USD_EUR': ''
};
var keys = Object.keys(converted);
var data,
    BTC,
    BCH,
    XMR;
var i = 0;
var message;
/* eslint-enable */

//Get initial data
getConversion();
//getBTC...other currencies

//Remove these and call in APP.js
setInterval(getConversion, 43200000);

function getConversion() {
    var uri = 'https://openexchangerates.org/api/latest.json?app_id=' + process.env.APP_ID;
    async.each(keys, function() {
        var key = keys[i];
        request.get(uri, (error, response, body) => {
            data = JSON.parse(body);
            if (error || data.error == 'true') {
                message = '*Error* Could not retrieve conversions: ';
                console.log(colours.error(message, error +
                    '\n' + '    Status: ' + data.status +
                    '\n' + '    API Message: ' + data.description));
                winston.error(`${data.status} - ${data.description} - ${message+error}`);
            } else {
                switch (key) {
                    case 'USD_GBP':
                        console.log(colours.info('*Succsss* Current ' + key +
                            ' value: ' + data.rates.GBP));
                        winston.info(`Success - ${key} - ${data.rates.GBP}`);
                        converted.USD_GBP = data.rates.GBP;
                        break;
                    case 'USD_EUR':
                        console.log(colours.info('*Success* Current ' + key +
                            ' value: ' + data.rates.EUR));
                        winston.info(`Success - ${key} - ${data.rates.EUR}`);
                        converted.USD_EUR = data.rates.EUR;
                        break;
                    default:
                        message = 'Currency conversion not supported';
                        console.log(colours.warn('*Warning* ', message));
                        winston.warn(`${message}`);
                        break;
                        //Add more if and when needed see:
                        //https://docs.openexchangerates.org/docs/supported-currencies
                }

            }
        });
        i++;
    });
    i = 0;
}


//function getBTC() {

//}

module.exports.convert = converted;
