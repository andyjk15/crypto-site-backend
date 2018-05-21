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
var exchanges = [
    process.env.BTCe1,
    process.env.BTCe2,
    process.env.BTCe3,
    process.env.BCHe1,
    process.env.BCHe2,
    process.env.BCHe3,
    process.env.ETHe1,
    process.env.ETHe2,
    process.env.ETHe3,
    process.env.ETNe1,
    process.env.ETNe2,
    process.env.ETNe3,
    process.env.DASHe1,
    process.env.DASHe2,
    process.env.DASHe3,
    process.env.DCRe1,
    process.env.DCRe2,
    process.env.DCRe3,
    process.env.XMRe1,
    process.env.XMRe2,
    process.env.XMRe3,
    process.env.LTCe1,
    process.env.LTCe2,
    process.env.LTCe3,
    process.env.SCe1,
    process.env.SCe2,
    process.env.SCe3,
    process.env.UBQe1,
    process.env.UBQe2,
    process.env.UBQe3,
];

var BTCprices = [];
var BTCincreases = [];


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
getCryptoPrices();
getHashrateNetwork();
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
                //console.log(colours.error(message, error +
                //    '\n' + '    Status: ' + data.status +
                //    '\n' + '    API Message: ' + data.description));
                winston.error(`${data.status} - ${data.description} - ${message+error}`);
            } else {
                switch (key) {
                    case 'USD_GBP':
                        //console.log(colours.info('*Succsss* Current ' + key +
                        //    ' value: ' + data.rates.GBP));
                        winston.info(`Success - ${key} - ${data.rates.GBP}`);
                        converted.USD_GBP = data.rates.GBP;
                        break;
                    case 'USD_EUR':
                        //console.log(colours.info('*Success* Current ' + key +
                        //    ' value: ' + data.rates.EUR));
                        winston.info(`Success - ${key} - ${data.rates.EUR}`);
                        converted.USD_EUR = data.rates.EUR;
                        break;
                    default:
                        message = 'Currency conversion not supported';
                        //console.log(colours.warn('*Warning* ', message));
                        winston.warn(`Warning - ${message}`);
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


function getCryptoPrices() {
    for (i = 0; i < exchanges.length-1; i++) {

    }
}

function getBTC() {
    var uri = process.env.BTCe1;

}

function getHashrateNetwork() {

}

module.exports.convert = converted;
