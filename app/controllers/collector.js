/* eslint-disable */
var request = require('request');
var async = require("async");
var appRoot = require('app-root-path');
var time = require('moment');
var winston = require(appRoot + '/helpers/winston.js');
var fs = require('fs');
var dataP = require('./datastore');
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

var keys = Object.keys(converted);

var cryptdata;
/* eslint-enable */

// Get initial data
// getConversion();
//getCryptoPrices();
getHashrateNetwork();

// Remove these and call in APP.js
setInterval(getConversion, 43200000);

function getConversion () {
  var uri = `https://openexchangerates.org/api/latest.json?app_id=${process.env.APP_ID}`,
      i = 0;

  async.each(keys, function () {
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
  i = 0;
}

function getCryptoPrices () {
  var x = 0;
  async.each(exchanges, function () {
    var exchange = exchanges[x];
    if (exchange !== '') {
      request.get(exchange, (err, res, body) => {
        if (err) {
          winston.error(`Invalid currency syntax - ${err}`);
          process.exit();
        }
        cryptdata = JSON.parse(body);
        switchcrypto(exchange);
      });
    }
    x++;
  });
  x = 0;
}

function switchcrypto (exchange) {
  switch (true) {
    case /BTCU/.test(exchange) || /btcu/.test(exchange) || /btc-/.test(exchange) || /BTC-/.test(exchange):
        var BTC = [];
        var wait = async () => {
            var ExJSON = await getExchangeJSON(exchange);
            BTC.push(ExJSON);
            var count = await rdfile('BTCe');
            if (BTC.length === count) {
                var prices = await getAverages(BTC);
                BTCprices.push(prices);
            }
        };
      wait();

      dataP.getCurrentPrice(BTCprices[0]); //Code in datastore.js (this just passes in that price to be saved to the db)

      BTC = [];
      break;
    case /BCH/.test(exchange) || /bch/.test(exchange) || /bch-/.test(exchange) || /BCH-/.test(exchange):
        var BCH = [];
        var wait = async () => {
            var ExJSON = await getExchangeJSON(exchange);
            BCH.push(ExJSON);
            var count = await rdfile('BCHe');
            if (BCH.length === count) {
                var prices = await getAverages(BCH);
                BCHprices.push(prices);
            }
        };
      wait();

      dataP.getCurrentPrice(BCHprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)

      BCH = [];
      break;
    case /ETH/.test(exchange) || /eth/.test(exchange) || /eth-/.test(exchange) || /ETH-/.test(exchange):
      var wait = async () => {
        var ExJSON = await getExchangeJSON(exchange);
        ETH.push(ExJSON);
        var count = await rdfile('ETHe');
        if (ETH.length === count) {
          var prices = await getAverages(ETH);
          ETHprices.push(prices);
        }
      };
      wait();

      dataP.getCurrentPrice(ETHprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)

      ETH = [];
      break;
    case /ETN/.test(exchange) || /etn/.test(exchange) || /etn-/.test(exchange) || /ETN-/.test(exchange):
        var wait = async () => {
            var ExJSON = await getExchangeJSON(exchange);
            ETN.push(ExJSON);
            var count = await rdfile('ETNe');
            if (ETN.length === count) {
                var prices = await getAverages(ETN);
                ETNprices.push(prices);
            }
        };
        wait();

        dataP.getCurrentPrice(ETNprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)

        ETN = [];
        break;
    case /DASH/.test(exchange) || /dash/.test(exchange) || /dash-/.test(exchange) || /DASH-/.test(exchange):
        var wait = async () => {
            var ExJSON = await getExchangeJSON(exchange);
            DASH.push(ExJSON);
            var count = await rdfile('DASHe');
            if (DASH.length === count) {
                var prices = await getAverages(DASH);
                DASHprices.push(prices);
            }
        };
        wait();

        dataP.getCurrentPrice(DASHprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)

        DASH = [];
        break;
    case /DCR/.test(exchange) || /dcr/.test(exchange) || /dcr-/.test(exchange) || /DCR-/.test(exchange):
        var wait = async () => {
            var ExJSON = await getExchangeJSON(exchange);
            DCR.push(ExJSON);
            var count = await rdfile('DCRe');
            if (DCR.length === count) {
                var prices = await getAverages(DCR);
                DCRprices.push(prices);
            }
        };
        wait();

        dataP.getCurrentPrice(DCRprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)

        DCR = [];
        break;
    case /XMR/.test(exchange) || /xmr/.test(exchange) || /xmr-/.test(exchange) || /XMR-/.test(exchange):
        var wait = async () => {
            var ExJSON = await getExchangeJSON(exchange);
            XMR.push(ExJSON);
            var count = await rdfile('XMRe');
            if (XMR.length === count) {
                var prices = await getAverages(XMR);
                XMRprices.push(prices);
            }
        };
        wait();

        dataP.getCurrentPrice(XMRprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)

        XMR = [];
        break;
    case /LTC/.test(exchange) || /ltc/.test(exchange) || /ltc-/.test(exchange) || /LTC-/.test(exchange):
        var wait = async () => {
            var ExJSON = await getExchangeJSON(exchange);
            LTC.push(ExJSON);
            var count = await rdfile('LTCe');
            if (LTC.length === count) {
                var prices = await getAverages(LTC);
                LTCprices.push(prices);
            }
        };
        wait();

        dataP.getCurrentPrice(LTCprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)

        LTC = [];
        break;
    case /SC/.test(exchange) || /sc/.test(exchange) || /sc-/.test(exchange) || /SC-/.test(exchange):
        var wait = async () => {
            var ExJSON = await getExchangeJSON(exchange);
            SC.push(ExJSON);
            var count = await rdfile('SCe');
            if (SC.length === count) {
                var prices = await getAverages(SC);
                SCprices.push(prices);
            }
        };
        wait();

        dataP.getCurrentPrice(SCprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)

        SC = [];
        break;
    case /UBQ/.test(exchange) || /ubq/.test(exchange) || /ubq-/.test(exchange) || /UBQ-/.test(exchange):
        var wait = async () => {
            var ExJSON = await getExchangeJSON(exchange);
            UBQ.push(ExJSON);
            var count = await rdfile('UBQe');
            if (UBQ.length === count) {
                var prices = await getAverages(UBQ);
                UBQprices.push(prices);
            }
        };
        wait();

        dataP.getCurrentPrice(UBQprices[0]);  //Code in datastore.js (this just passes in that price to be saved to the db)

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

function getExchangeJSON (exchange) {
  var total;
  var promise = new Promise(function (resolve, reject) {
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

function getAverages (exchangeAverages) {
  var promise = new Promise(function (resolve) {
    var total = exchangeAverages.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    total = total / exchangeAverages.length;
    resolve(total);
  });
  return promise;
}

function rdfile (currency) {
  var reg = new RegExp(currency, 'g');
  var promise = new Promise(function (resolve, reject) {
    var file = fs.createReadStream(appRoot + '/config/currencies.env', {
      start: 42
    });
    file.on('error', err => {
      reject(err);
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

async function getHashrateNetwork () {
    let request = await requestHash();
    await dataP.sendHashrate(request);
}

function requestHash() {
    var promise = new Promise(function (resolve, reject) {
        request.get('http://moneroblocks.info/api/get_stats/', (err, response, body) => {
            var data = JSON.parse(body);
            if(err || response.statusCode !== 200){
                winston.error(`Cannot GET hashrate - ${err}`);
                reject(err);
            } else {
                var hashrate = {
                    hashrate: data.hashrate,
                    timestamp: time().format('llll')
                };
                console.log(hashrate);
                resolve(hashrate);
            }
        });
    });
    return promise;
}

module.exports.readFile = rdfile;
module.exports.averages = getAverages;
module.exports.exchangeJSON = getExchangeJSON;
module.exports.conversion = getConversion;