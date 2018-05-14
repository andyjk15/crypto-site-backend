/* eslint-disable */
var request = require('request');
var async = require("async");
var logger = require('winston');
var colours = require('../../helpers/chalk.js');
var dataP = require('./datapush');
//var dataC = require('./datacollect');
/* eslint-enable */

require('dotenv').config({
	path: '../../config/currencies.env'
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

//Remove these and call in APP.js
//async.eachSeries(key, function (err) {
//    getConversion(key, i);
//});

getConversion();
//getUSD_EUR();

function getConversion() {
	//for (i = 0; i < key.length; i++) {
	var converter = 'http://free.currencyconverterapi.com/api/v5/convert?q=';

	//console.log('====');
	//console.log(key[i]);
	//console.log(i);

	async.each(keys, function(err) {
		console.log(keys[i]);
		var key = keys[i];
		request.get(converter + key + '&compact=y', (error, response, body) => {
			console.log('Current key: ' + key);
			console.log(converter);
			if (error) {
				console.log(colours.error('Could not retrieve ' + key + ' convertion:', error));
			} else {
				data = JSON.parse(body);
				//console.log(keys);
				if (key == 'USD_GBP') {
					console.log(colours.info('Current ' + key + ' value: ' + data.USD_GBP.val));
					converted.USD_GBP = data.USD_GBP.val;
				} else if (key == 'USD_EUR') {
					console.log(colours.info('Current ' + key + ' value: ' + data.USD_EUR.val));
					converted.USD_EUR = data.USD_EUR.val;
				} else {
					console.log(colours.warn('Currency conversion not supported'));
				}
			}
		});
		i++;
	});
	//};
}

function getUSD_EUR() {
	request.get(process.env.USD_EUR, (error, response, body) => {
		if (error) {
			console.log(colours.error('Could not retrieve USD -> EUR convertion:', error));
		} else {
			data = JSON.parse(body);
			console.log(colours.info('Current USD -> EUR value: ' + data.USD_EUR.val));
			converted.USD_EUR = data.USD_EUR.val;
		}
	});
}

function getBTC() {

}

//module.exports.convert = convert;
