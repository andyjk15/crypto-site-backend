var express = require('express');
var router = express.Router();

var dc = require('../../app/controllers/datacollect.js');

//dc.coinbase_btc_gbp();
//Root view
router.get('/', function(req, res) {
	//coinbase_btc_gbp();
	//console.log('!!!!'+btc);
	res.send('Hello World');
});

module.exports = router;
