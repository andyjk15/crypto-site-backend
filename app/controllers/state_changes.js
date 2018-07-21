var request = require('request');
var async = require('async');
var appRoot = require('app-root-path');
var fs = require('fs');
var winston = require(appRoot + '/helpers/winston.js');
var datastore = require('./datastore.js');

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
var BTCincreases = {},
    BCHincreases = {},
    ETHincreases = {},
    ETNincreases = {},
    DASHincreases = {},
    DCRincreases = {},
    XMRincreases = {},
    LTCincreases = {},
    SCincreases = {},
    UBQincreases = {};

function getCrypto(exchanges) {
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
                console.log(exchange);
                switchcrypto(exchange, cryptdata);

            });
        }
        x++;
    });
    x = 0;
}

function switchcrypto(exchange, cryptdata) { //DO FALLBACK EXCHANGE CHECK HERE
    switch (true) {
        case /BTCU/.test(exchange) || /btcu/.test(exchange) || /btc-/.test(exchange) || /BTC-/.test(exchange):
            var BTC = [];
            var wait = async () => {
                var ExJSON = await getExchangeJSON(exchange, cryptdata);
                BTC.push(ExJSON);
                // var count = await rdfile('BTCe');
                //if (BTC.length === count) {
                var prices = await getAverages(BTC);
                BTCprices.push(prices);
                }
            };
            wait();

            //datastore.getCurrentPrice(BTCprices[0]); //Code in datastore.js (this just passes in that price to be saved to the db)
            BTC = [];
            break;
        case /BCH/.test(exchange) || /bch/.test(exchange) || /bch-/.test(exchange) || /BCH-/.test(exchange):
            var BCH = [];
            var wait = async () => {
                var ExJSON = await getExchangeJSON(exchange, cryptdata);
                BCH.push(ExJSON);
                // var count = await rdfile('BCHe');
                if (BCH.length === count) {
                    var prices = await getAverages(BCH);
                    BCHprices.push(prices);
                }
            };
            wait();

            //datastore.getCurrentPrice(BCHprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)
            BCH = [];
            break;
        case /ETH/.test(exchange) || /eth/.test(exchange) || /eth-/.test(exchange) || /ETH-/.test(exchange):
            var ETH = [];
            var wait = async () => {
                var ExJSON = await getExchangeJSON(exchange, cryptdata);
                ETH.push(ExJSON);
                // var count = await rdfile('ETHe');
                if (ETH.length === count) {
                    var conversion = await convertToUSD(exchange, ETH);
                    var prices = await getAverages(conversion);
                    console.log(prices);
                    ETHprices.push(prices);
                }
            };
            wait();

            //datastore.getCurrentPrice(ETHprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)
            ETH = [];
            break;
        case /ETN/.test(exchange) || /etn/.test(exchange) || /etn-/.test(exchange) || /ETN-/.test(exchange):
            var ETN = [];
            var wait = async () => {
                var ExJSON = await getExchangeJSON(exchange, cryptdata);
                ETN.push(ExJSON);
                // var count = await rdfile('ETNe');
                if (ETN.length === count) {
                    var prices = await getAverages(ETN);
                    ETNprices.push(prices);
                }
            };
            wait();

            //datastore.getCurrentPrice(ETNprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)
            ETN = [];
            break;
        case /DASH/.test(exchange) || /dash/.test(exchange) || /dash-/.test(exchange) || /DASH-/.test(exchange):
            var DASH = [];
            var wait = async () => {
                var ExJSON = await getExchangeJSON(exchange, cryptdata);
                DASH.push(ExJSON);
                // var count = await rdfile('DASHe');
                if (DASH.length === count) {
                    var prices = await getAverages(DASH);
                    DASHprices.push(prices);
                }
            };
            wait();

            //datastore.getCurrentPrice(DASHprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)
            DASH = [];
            break;
        case /DCR/.test(exchange) || /dcr/.test(exchange) || /dcr-/.test(exchange) || /DCR-/.test(exchange):
            var DCR = [];
            var wait = async () => {
                var ExJSON = await getExchangeJSON(exchange, cryptdata);
                DCR.push(ExJSON);
                var count = await rdfile('DCRe');
                if (DCR.length === count) {
                    var prices = await getAverages(DCR);
                    DCRprices.push(prices);
                }
            };
            wait();

            //datastore.getCurrentPrice(DCRprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)
            DCR = [];
            break;
        case /XMR/.test(exchange) || /xmr/.test(exchange) || /xmr-/.test(exchange) || /XMR-/.test(exchange):
            var XMR = [];
            var wait = async () => {
                var ExJSON = await getExchangeJSON(exchange, cryptdata);
                XMR.push(ExJSON);
                var count = await rdfile('XMRe');
                if (XMR.length === count) {
                    var prices = await getAverages(XMR);
                    XMRprices.push(prices);
                }
            };
            wait();

            //datastore.getCurrentPrice(XMRprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)
            XMR = [];
            break;
        case /LTC/.test(exchange) || /ltc/.test(exchange) || /ltc-/.test(exchange) || /LTC-/.test(exchange):
            var LTC = [];
            var wait = async () => {
                var ExJSON = await getExchangeJSON(exchange, cryptdata);
                LTC.push(ExJSON);
                var count = await rdfile('LTCe');
                if (LTC.length === count) {
                    var prices = await getAverages(LTC);
                    LTCprices.push(prices);
                }
            };
            wait();

            //datastore.getCurrentPrice(LTCprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)
            LTC = [];
            break;
        case /SC/.test(exchange) || /sc/.test(exchange) || /sc-/.test(exchange) || /SC-/.test(exchange):
            var SC = [];
            var wait = async () => {
                var ExJSON = await getExchangeJSON(exchange, cryptdata);
                SC.push(ExJSON);
                var count = await rdfile('SCe');
                if (SC.length === count) {
                    var prices = await getAverages(SC);
                    SCprices.push(prices);
                }
            };
            wait();

            //datastore.getCurrentPrice(SCprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)
            SC = [];
            break;
        case /UBQ/.test(exchange) || /ubq/.test(exchange) || /ubq-/.test(exchange) || /UBQ-/.test(exchange):
            var UBQ = [];
            var wait = async () => {
                var ExJSON = await getExchangeJSON(exchange, cryptdata);
                UBQ.push(ExJSON);
                // var count = await rdfile('UBQe');
                if (UBQ.length === count) {
                    var prices = await getAverages(UBQ);
                    UBQprices.push(prices);
                }
            };
            wait();

            //datastore.getCurrentPrice(UBQprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)
            UBQ = [];
            break;
        default:
            winston.error(`Currency not supported - ${exchange}`);
            process.exit();
            break;
    }
    // Add more if and when needed
    // DO NOT ADD Exchanges that do BTC_othercurrency or BTC-othercurrency as I cannot be bothered to handle this
}

function getExchangeJSON(exchange, cryptdata) {
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
            reject(winston.error(`404 - Could not GET JSON - Unknown exchange ${exchange}`));
        }
    });
    return promise;
}

function convertToUSD(exchange, currency) {
    var promise = new Promise(function(resolve, reject) {
        if (/-btc/.test(exchange) || /-BTC/.test(exchange) || /_btc/.test(exchange) || /_BTC/.test(exchange)) {
            currency = (currency * BTCprices[0]);
            resolve(currency);
        }
        reject(currency);
    });
    return promise;
}

function getAverages(exchangeAverages) {
    var promise = new Promise(function(resolve) {
        var total = exchangeAverages.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        total = total / exchangeAverages.length;
        resolve(total);
    });
    return promise;
}

// function rdfile(currency) {
//     var reg = new RegExp(currency, 'g');
//     var promise = new Promise(function(resolve, reject) {
//         var file = fs.createReadStream(appRoot + '/config/currencies.env', {
//             start: 42
//         });
//         file.on('error', err => {
//             reject(err);
//         });
//         file.on('data', data => {
//             console.log(data);
//             data = data.toString();
//             data = (data.match(reg) || []).length;
//             data = parseInt(data);
//             resolve(data);
//         });
//     });
//     return promise;
// }

module.exports.getCrypto = getCrypto;

//For Tests
// module.exports.readFile = rdfile;
module.exports.averages = getAverages;
module.exports.exchangeJSON = getExchangeJSON;
