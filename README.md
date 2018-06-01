# Crypto-site
[![Build Status](https://travis-ci.org/andyjk15/crypto-site.svg?branch=master)](https://travis-ci.org/andyjk15/crypto-site)

Cryptocurrency tracking site - The goal of this project is to create a personal website that displays data on the cryptocurrencies I have holdings in.
This is displayed on various pages for each currency, the root dir will display graphs for all currencies.

Currencies supported:
```
XMR (Monero) 
DASH (Dash)
DCR (Decred)
BTC (Bitcoin)
BCH (Bitcoin Cash)
LTC (Litecoin)
ETN (Electroneum)
ETH (Ethereum)
SC (Siacoin)
UBQ (Ubiq)
ZEC (Zcash)
```

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

```
Nodejs >= 4.8
For testing: 
Jasmine -- npm install -g jasmine
Grunt   -- npm install -g grunt-cli
Eslint  -- npm install -g eslint
karma   -- npm install -g karma-cli
```

### Installing

Very simple..
```
apt-get update
```
Make sure you are running Node 4.8 or higher

Download the repo:
```
git clone https://github.com/andyjk15/crypto-site.git
```
```
cd crypto-site
```
This will install of the packages needed
```
npm install
```
To run the app
```
npm start
```

## Configuration
Don't forget to set up the enviroment variables:
```
APP_ID            - This is the api key to the currency conversion api of your choice (I use https://openexchangerates.org/account)
SENDGRID_API_KEY  - API for Sendgrid (If you want the email feature)

export ENV_VAR='SOME_KEY'
```

## Running the tests

The test are written for Jasmine, prior to running the test install Jasmine globally on your system.
```
npm install -g jasmine
```
All the test are located under the spec/ folder.
To run the tests simply run
```
npm test    -- This will run Karma which will run through coverage and jasmine tests
jasmine *   -- Just for running of jasmine tests
```

## Deployment

For dev purposes I suggest installing Nodemon to run the app as this will restart itself automatically when there is a change.
```
npm install -g nodemon
```
To start:
```
nodemon server.js
```

To deploy this app, I suggest using PM2.
```
npm install -g pm2

pm2 start server.js
```
To show currently running processes
```
pm2 list
```
To show currently running processes and monit log output (very useful)
```
pm2 monit
```

### Built With

* [Express](https://expressjs.com/) -- Framework
* [Nano](https://github.com/apache/couchdb-nano) -- CouchDB
* [Less](http://lesscss.org/) -- CSS templater

### Testing With

* [Jasmine](https://jasmine.github.io/) -- Unit testing
* [Eslint](https://eslint.org/) -- JS format and syntax testing
* [Grunt](https://gruntjs.com/) -- Task runner, used for uglify, js-beautifier, line endings, trailing spaces, cssmin and pugjs compilation
* [Karma](https://karma-runner.github.io/2.0/index.html) -- Coverage and unit tests

### Logging With

* [Morgan](https://github.com/expressjs/morgan) -- HTTP response logging
* [Winston](https://github.com/winstonjs/winston) -- All logging 

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [...](...). 

## Authors

* **Andrew Sotheran** - *Initial work* - [andyjk15](https://github.com/andyjk15)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
