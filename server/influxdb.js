'use strict';

const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../config/influxdb.json')[env];
const Influx    = require('influx');

const influx = new Influx.InfluxDB(config);

module.exports = influx;
