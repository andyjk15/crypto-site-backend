var express = require('express');
var router = express.Router();
require('dotenv').config({path: '../config/coinbase.env'});
var Client = require('coinbase').Client;
var client = new Client({
        'apiKey': 'process.env.API_KEY',
            'apiSecret': 'process.env.API_SECRET'
});

var btc = [];
var coinbase_btc_gbp = function() {
    client.getSellPrice({'currencyPair': 'BTC-GBP'}, function(err, price) {
        btc = JSON.stringify(price);
        console.log(price);
        console.log(btc);
    });
};

coinbase_btc_gbp();
//Root view
router.get('/', function(req, res) {
    coinbase_btc_gbp();
    console.log("!!!!"+btc);
    res.send(btc);
});

module.exports = router;
