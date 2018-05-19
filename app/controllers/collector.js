/* eslint-disable */
var request = require('request');
var async = require("async");
var logger = require('winston');
var colours = require('../../helpers/chalk.js');
var dataP = require('./datapush');
//var dataC = require('./datacollect');

require('dotenv').config({
    path: './config/currencies.env'
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
/* eslint-enable */

//Get initial data
getConversion();
//getBTC...other currencies

//Remove these and call in APP.js
setInterval(getConversion, 43200000);

function getConversion() {
	var uri = 'https://openexchangerates.org/api/latest.json?app_id=' + process.env.APP_ID;
	async.each(keys, function(err) {
		var key = keys[i];
		request.get(uri, (error, response, body) => {
			data = JSON.parse(body);
			if (error || data.error == 'true') {
				console.log(colours.error('*Error* Could not retrieve convertions:', error +
                    '\n' + '    Status: ' + data.status +
                    '\n' + '    API Message: ' + data.description));
			} else {
				switch (key) {
				case 'USD_GBP':
					console.log(colours.info('*Succsss* Current ' + key +
                            ' value: ' + data.rates.GBP));
					converted.USD_GBP = data.rates.GBP;
					break;
				case 'USD_EUR':
					console.log(colours.info('*Success* Current ' + key +
                            ' value: ' + data.rates.EUR));
					converted.USD_EUR = data.rates.EUR;
					break;
				default:
					console.log(colours.warn('*Warning* Currency conversion not supported'));
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


function getBTC() {

}

//module.exports.convert = convert;
