/* eslint-disable */
var request = require('request');
var async = require("async");
var appRoot = require('app-root-path');
var winston = require(appRoot + '/helpers/winston.js');
var time = require('moment');
var state_changes = require('./state_changes');
var datastore = require('./datastore');

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
    process.env.BCHe1,
    process.env.BCHe2,
    process.env.ETHe1,
    process.env.ETHe2,
    process.env.ETNe1,
    process.env.ETNe2,
    process.env.DASHe1,
    process.env.DASHe2,
    process.env.DCRe1,
    process.env.DCRe2,
    process.env.XMRe1,
    process.env.XMRe2,
    process.env.LTCe1,
    process.env.LTCe2,
    process.env.SCe1,
    process.env.SCe2,
    process.env.UBQe1,
    process.env.UBQe2,
];

var keys = Object.keys(converted);
/* eslint-enable */

// Get initial data
getConversion();
getCryptoPrices();
getHashrateNetwork();

// Remove these and call in APP.js
setInterval(getConversion, 43200000); //12 hrs
setInterval(getCryptoPrices, 300000); //5 mins
setInterval(getHashrateNetwork, 120000); //2 mins

function getConversion() {
    var uri = `https://openexchangerates.org/api/latest.json?app_id=${process.env.APP_ID}`,
        i = 0;

    async.each(keys, function() {
        var key = keys[i];
        request.get(uri, (error, response, body) => {
            var data = JSON.parse(body);
            if (error || data.error === 'true') {
                var message = '*Error* Could not retrieve conversions: ';
                winston.error(`${data.status} - ${data.description} - ${message + error}`);
            } else {
                switch (key) {
                    case 'USD_GBP':
                        winston.info(`Success - ${key} - ${data.rates.GBP}`);
                        converted.USD_GBP = data.rates.GBP;
                        break;
                    case 'USD_EUR':
                        winston.info(`Success - ${key} - ${data.rates.EUR}`);
                        converted.USD_EUR = data.rates.EUR;
                        break;
                    default:
                        message = 'Currency conversion not supported';
                        winston.warn(`Warning - ${message}`);
                        break;
                        // Add more if and when needed see:
                        // https://docs.openexchangerates.org/docs/supported-currencies
                }
            }
        });
        i++;
    });
    //datastore.pushConversion(converted);              //Added document into CouchDB
    i = 0;
}

function getCryptoPrices() {
    var x = 0;
    async.each(exchanges, function() {
        var exchange = exchanges[x];
        if (exchange !== '') {
            request.get(exchange, (err, res, body) => {
                if (err) {
                    winston.error(`Invalid currency syntax - ${err}`);
                    process.exit();
                }
                var cryptdata = JSON.parse(body);
                var wait = async () => {
                    var shit = await state_changes.getCrypto(exchange, cryptdata); //Async BROKE add async into state_changes
                };
                wait();
            });
        }
        x++;
    });
    x = 0;
}

async function getHashrateNetwork() {
    let request = await requestHash();
    //await datastore.sendHashrate(request);
}

function requestHash() {
    var promise = new Promise(function(resolve, reject) {
        request.get('http://moneroblocks.info/api/get_stats/', (err, response, body) => {
            var data = JSON.parse(body);
            if (err || response.statusCode !== 200) {
                winston.error(`Cannot GET hashrate - ${err}`);
                reject(err);
            } else {
                data.hashrate = (data.hashrate / 1000000).toFixed(2);
                var hashrate = {
                    hashrate: data.hashrate,
                    timestamp: time().format('llll')
                };
                winston.info(`GET hashrate succeeded - Hashrate at - ${data.hashrate}`);
                resolve(hashrate);
            }
        });
    });
    return promise;
}

module.exports.hashrate = getHashrateNetwork;

//For Testing
module.exports.conversion = getConversion;
