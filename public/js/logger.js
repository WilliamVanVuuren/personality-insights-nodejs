'use strict';

const config = require('config');
const bunyan = require('bunyan');

const log = bunyan.createLogger({
  name: 'call4code',
  level: config.get('log_level'),
});

module.exports = { log };
