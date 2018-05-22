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

var BTCprices = [],
    BCHprices = [],
    ETHprices = [];
var BTCincreases = [];


var keys = Object.keys(converted);
var data,
    cryptdata,
    currency,
    BTCtotal,
    BTC = [],
    BCH = [],
    ETH = [],
    XMR = [];
var i = 0,
    x = 0;
var message;
/* eslint-enable */

//Get initial data
//getConversion();
getCryptoPrices();
getHashrateNetwork();

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
        async.each(exchanges, function() {
            var exchange = exchanges[x];
            if (exchange !== '') {
                request.get(exchange, (err, res, body) => {

                if(err){
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
        case /BTCU/.test(exchange)||/btcu/.test(exchange)||/btc-/.test(exchange)||/BTC-/.test(exchange):
            console.log('• Matched BTC test');
            BTC.push(getExchangeJSON(exchange));
            BTCprices.push(getAverages(BTC));
            break;
        case /BCH/.test(exchange)||/bch/.test(exchange)||/bch-/.test(exchange)||/BCH-/.test(exchange):
            console.log('• Matched BCH test');
            BCH.push(getExchangeJSON(exchange));
            BCHprices.push(getAverages(BCH));
            break;
        case /ETH/.test(exchange)||/eth/.test(exchange)||/eth-/.test(exchange)||/ETH-/.test(exchange):
            console.log('• Matched ETH test');
            ETH.push(getExchangeJSON(exchange));
            ETHprices.push(getAverages(ETH));
            break;
        case /ETN/.test(exchange)||/etn/.test(exchange)||/etn-/.test(exchange)||/ETN-/.test(exchange):
            console.log('• Matched ETN test');
            console.log(cryptdata);
            break;
        case /DASH/.test(exchange)||/dash/.test(exchange)||/dash-/.test(exchange)||/DASH-/.test(exchange):
            console.log('• Matched DASH test');
            console.log(cryptdata);
            break;
        case /DCR/.test(exchange)||/dcr/.test(exchange)||/dcr-/.test(exchange)||/DCR-/.test(exchange):
            console.log('• Matched DCR test');
            console.log(cryptdata);
            break;
        case /XMR/.test(exchange)||/xmr/.test(exchange)||/xmr-/.test(exchange)||/XMR-/.test(exchange):
            console.log('• Matched XMR test');
            console.log(cryptdata);
            break;
        case /LTC/.test(exchange)||/ltc/.test(exchange)||/ltc-/.test(exchange)||/LTC-/.test(exchange):
            console.log('• Matched LTC test');
            console.log(cryptdata);
            break;
        case /SC/.test(exchange)||/sc/.test(exchange)||/sc-/.test(exchange)||/SC-/.test(exchange):
            console.log('• Matched SC test');
            console.log(cryptdata);
            break;
        case /UBQ/.test(exchange)||/ubq/.test(exchange)||/ubq-/.test(exchange)||/UBQ-/.test(exchange):
            console.log('• Matched UBQ test');
            console.log(cryptdata);
            break;
      default:
        winston.error(`Currency not supported - ${exchange}`);
        console.log(cryptdata);
        process.exit();
        break;
    }
    //Add more if and when needed
    //DO NOT ADD Exchanges that do BTC_othercurrency or BTC-othercurrency as I cannot be bothered to handle this
}

function getExchangeJSON(exchange) {
    var total;
    if (exchange.includes('bitfinex')) {
        total = (parseInt(cryptdata.mid) +
            parseInt(cryptdata.low) +
            parseInt(cryptdata.high))/3;
        return total;
    } else if (exchange.includes('gdax')) {
        total = (parseInt(cryptdata.price));
        return total;
    } else if (exchange.includes('hitbtc')) {
        total = (parseInt(cryptdata.low) +
            parseInt(cryptdata.high) +
            parseInt(cryptdata.last))/3;
        return total;
    } else if (exchange.includes('kucoin')) {
        total = (parseInt(cryptdata.data.low).toPrecision() +
            parseInt(cryptdata.data.high).toPrecision() +
            parseInt(cryptdata.data.lastDealPrice).toPrecision())/3;
        return total;
    } else if (exchange.includes('cryptopia')) {
        total = (parseInt(cryptdata.Data.Low) +
            parseInt(cryptdata.Data.High) +
            parseInt(cryptdata.Data.LastPrice))/3;
        return total;
    } else if (exchange.includes('binance')) {
        total = (parseInt(cryptdata.price));
        return total;
    } else { winston.error(`404 - Could not GET json - Unknown exchange ${exchange}`);}
}

function getAverages(exchangeAverages) {
    var total;
    for ( x = 0; x < exchangeAverages.length; x++) {
        total += exchangeAverages[x];
    }
    var average = total / exchangeAverages.length;
    return average;
}

function getHashrateNetwork() {

}

module.exports.convert = converted;
