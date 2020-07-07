'use strict';

const config = require('config');
const bunyan = require('bunyan');

const path = require('path');
// load default variables for testing
require('dotenv').config({ path: path.join(__dirname, '../.env') });

if (!process.env.log_level) {
  return;
} else{
	var level = process.env.log_level
	console.log("******** log_level: " + level)
}

const log = bunyan.createLogger({
  name: 'call4code',
  //level: config.get('log_level'),
  level: level,
});

module.exports = { log };
