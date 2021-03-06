/* eslint-disable */
var request = require('request');
var async = require("async");
var appRoot = require('app-root-path');
var winston = require(appRoot + '/helpers/winston.js');
var time = require('moment');
var state_changes = require('./state_changes');
var exchange_list = require(appRoot + '/config/currencies.json');
var fs = require('fs');
var datastore = require('./datastore');

require('dotenv').config({
    path: appRoot + '/config/keys.env'
});

var converted = {
    'USD_GBP': '',
    'USD_EUR': ''
};

var exchanges = [];

var keys = Object.keys(converted);
/* eslint-enable */

// Get initial data
initialCalls();

async function initialCalls() {
    let read = await readExchanges();
    getCryptoPrices();
    //getConversion();
    // getHashrateNetwork();
    //process.exit();
}

// Remove these and call in APP.js
setInterval(getConversion, 43200000); //12 hrs
setInterval(getCryptoPrices, 300000); //5 mins
setInterval(getHashrateNetwork, 120000); //2 mins

function readExchanges() {
    var promise = new Promise(function(resolve, reject) {
        var data = exchange_list.currencies;
        var Exchange_keys = Object.keys(data);
        var i = 0;
        async.each(Exchange_keys, function() {
            var key = Exchange_keys[i];
            if (data[key].exchange !== '') {
                exchanges.push(data[key].exchange);
            } else if (data[key].fallback !== '') {
                exchanges.push(data[key].fallback);
                winston.warn(`${key} - No fallback set`);
            } else {
                winston.error(`No exchange uri specified - exchange [null], fallback [null] - ${key}`);
                process.exit;
            }
            i++;
        });
        resolve();
    });

    return promise;
}

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
    state_changes.getCrypto(exchanges); //Async BROKE add async into state_changes
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
