const influx    = require('./influxdb.js');
const express   = require('express');
const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../config/api.json')[env];

influx.getDatabaseNames()
.then((names) => {
  console.log(`InfluxDB database list:\n${names}`);
});
