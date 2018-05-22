/* eslint-disable */
var request = require('request');
var async = require("async");
var appRoot = require('app-root-path');
var winston = require(appRoot + '/helpers/winston.js');
var colours = require(appRoot + '/helpers/chalk.js');
var fs = require('fs');
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
    // process.env.BCHe1,
    // process.env.BCHe2,
    // process.env.ETHe1,
    // process.env.ETHe2,
    // process.env.ETNe1,
    // process.env.ETNe2,
    // process.env.DASHe1,
    // process.env.DASHe2,
    // process.env.DCRe1,
    // process.env.DCRe2,
    // process.env.XMRe1,
    // process.env.XMRe2,
    // process.env.LTCe1,
    // process.env.LTCe2,
    // process.env.SCe1,
    // process.env.SCe2,
    // process.env.UBQe1,
    // process.env.UBQe2,
];

var BTCprices = [],
    BCHprices = [],
    ETHprices = [],
    ETNprices = [],
    DASHprices = [],
    DCRprices = [],
    XMRprices = [],
    LTCprices = [],
    SCprices = [],
    UBQprices = [];
var BTCincreases = [];


var keys = Object.keys(converted);
var BTC = [],
    BCH = [],
    ETH = [],
    ETN = [],
    DASH = [],
    DCR = [],
    XMR = [],
    LTC = [],
    SC = [],
    UBQ = [];

var cryptdata;
/* eslint-enable */

//Get initial data
//getConversion();
getCryptoPrices();
// getHashrateNetwork();

//Remove these and call in APP.js
setInterval(getConversion, 43200000);

function getConversion() {
    var data, message;
    var i = 0;
    var uri = 'https://openexchangerates.org/api/latest.json?app_id=' + process.env.APP_ID;
    async.each(keys, function() {
        var key = keys[i];
        request.get(uri, (error, response, body) => {
            data = JSON.parse(body);
            if (error || data.error == 'true') {
                message = '*Error* Could not retrieve conversions: ';
                winston.error(`${data.status} - ${data.description} - ${message+error}`);
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
    var x = 0;
    async.each(exchanges, function() {
        var exchange = exchanges[x];
        if (exchange !== '') {
            request.get(exchange, (err, res, body) => {

                if (err) {
                    winston.error(`Invald currency syntax - ${err}`);
                    process.exit();
                }
                cryptdata = JSON.parse(body);
                switchcrypto(exchange, cryptdata);
            });
        }
        x++;

    });
    x = 0;
}

function switchcrypto(exchange, cryptdata) {
    switch (true) {
        case /BTCU/.test(exchange) || /btcu/.test(exchange) || /btc-/.test(exchange) || /BTC-/.test(exchange):
            var wait = async () => {                            /* eslint-disable */
                var ExJSON = await getExchangeJSON(exchange);   /* eslint-enable */
                BTC.push(ExJSON);
                var count = await rdfile('BTCe');
                if (BTC.length === count) {
                    var prices = await getAverages(BTC);
                    BTCprices.push(prices);
                }
            }
            wait();
            BTC = []
            break;
        case /BCH/.test(exchange) || /bch/.test(exchange) || /bch-/.test(exchange) || /BCH-/.test(exchange):
            var wait = async () => {                            /* eslint-disable */
                var ExJSON = await getExchangeJSON(exchange);   /* eslint-disable */
                BCH.push(ExJSON);
                var count = await rdfile('BCHe');
                if (BCH.length === count) {
                    var prices = await getAverages(BCH);
                    BCHprices.push(prices);
                }
            }
            wait();
            BCH = []
            break;
        case /ETH/.test(exchange) || /eth/.test(exchange) || /eth-/.test(exchange) || /ETH-/.test(exchange):
            var wait = async () => {                            /* eslint-disable */
                var ExJSON = await getExchangeJSON(exchange);   /* eslint-disable */
                ETH.push(ExJSON);
                var count = await rdfile('ETHe');
                if (ETH.length === count) {
                    var prices = await getAverages(ETH);
                    ETHprices.push(prices);
                }
            }
            wait();
            ETH = []
            break;
        case /ETN/.test(exchange) || /etn/.test(exchange) || /etn-/.test(exchange) || /ETN-/.test(exchange):
            console.log('• Matched ETN test');
            ETN.push(getExchangeJSON(exchange));
            ETNprices.push(getAverages(ETN));
            break;
        case /DASH/.test(exchange) || /dash/.test(exchange) || /dash-/.test(exchange) || /DASH-/.test(exchange):
            console.log('• Matched DASH test');
            DASH.push(getExchangeJSON(exchange));
            DASHprices.push(getAverages(DASH));
            break;
        case /DCR/.test(exchange) || /dcr/.test(exchange) || /dcr-/.test(exchange) || /DCR-/.test(exchange):
            console.log('• Matched DCR test');
            DCR.push(getExchangeJSON(exchange));
            DCRprices.push(getAverages(DCR));
            break;
        case /XMR/.test(exchange) || /xmr/.test(exchange) || /xmr-/.test(exchange) || /XMR-/.test(exchange):
            console.log('• Matched XMR test');
            XMR.push(getExchangeJSON(exchange));
            XMRprices.push(getAverages(XMR));
            break;
        case /LTC/.test(exchange) || /ltc/.test(exchange) || /ltc-/.test(exchange) || /LTC-/.test(exchange):
            console.log('• Matched LTC test');
            LTC.push(getExchangeJSON(exchange));
            LTCprices.push(getAverages(LTC));
            break;
        case /SC/.test(exchange) || /sc/.test(exchange) || /sc-/.test(exchange) || /SC-/.test(exchange):
            console.log('• Matched SC test');
            SC.push(getExchangeJSON(exchange));
            SCprices.push(getAverages(SC));
            break;
        case /UBQ/.test(exchange) || /ubq/.test(exchange) || /ubq-/.test(exchange) || /UBQ-/.test(exchange):
            console.log('• Matched UBQ test');
            UBQ.push(getExchangeJSON(exchange));
            UBQprices.push(getAverages(UBQ));
            break;
        default:
            winston.error(`Currency not supported - ${exchange}`);
            //console.log(cryptdata);
            process.exit();
            break;
    }
    //Add more if and when needed
    //DO NOT ADD Exchanges that do BTC_othercurrency or BTC-othercurrency as I cannot be bothered to handle this
}

function getExchangeJSON(exchange) {
    var total;
    var promise = new Promise(function(resolve, reject) {
        if (exchange.includes('bitfinex')) {
            total = (parseInt(cryptdata.mid) +
                parseInt(cryptdata.low) +
                parseInt(cryptdata.high));
            total = total / 3;
            resolve(total);
        } else if (exchange.includes('hitbtc')) {
            total = (parseInt(cryptdata.low) +
                parseInt(cryptdata.high) +
                parseInt(cryptdata.last));
            total = total / 3;
            resolve(total);
        } else if (exchange.includes('kucoin')) {
            total = (parseInt(cryptdata.data.low).toPrecision() +
                parseInt(cryptdata.data.high).toPrecision() +
                parseInt(cryptdata.data.lastDealPrice).toPrecision()) / 3;
            resolve(total);
        } else if (exchange.includes('cryptopia')) {
            total = (parseInt(cryptdata.Data.Low) +
                parseInt(cryptdata.Data.High) +
                parseInt(cryptdata.Data.LastPrice)) / 3;
            resolve(total);
        } else if (exchange.includes('binance')) {
            total = (parseInt(cryptdata.price));
            resolve(total);
        } else {
            reject(winston.error(`404 - Could not GET json - Unknown exchange ${exchange}`));
        }
    });
    return promise;
}

function getAverages(exchangeAverages) {
    var promise = new Promise(function(resolve, reject) {
        var total = exchangeAverages.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        total = total / exchangeAverages.length;
        resolve(total);
    });
    return promise;
}

function rdfile(currency) {
    var reg = new RegExp(currency, "g");
    var promise = new Promise(function(resolve, reject) {
        var file = fs.createReadStream(appRoot + '/config/currencies.env', {
            start: 42
        });
        file.on('error', err => {
            reject(err)
        });
        file.on('data', data => {
            data = data.toString();
            data = (data.match(reg) || []).length;
            data = parseInt(data);
            resolve(data);
        });
    });
    return promise;
}

function getHashrateNetwork() {

}

module.exports.convert = converted;
