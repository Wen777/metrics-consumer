'use strict';

const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../config/influxdb.json')[env];
const Influx    = require('influx');

const schema    = [
  {
    measurement: 'load_testing',
    fields: {
      clients: Influx.FieldType.INTEGER,
      hatchRate: Influx.FieldType.INTEGER,
      requests: Influx.FieldType.INTEGER
    },
    tags: [
      'hostname',
      'mode'
    ]
  },
  {
    measurement: 'load_testing_result',
    fields: {
      requestStats: Influx.FieldType.STRING
    },
    tags: [
      'hostname',
      'method',
      'mode'
    ]
  }
];

config.schema = schema;
const influx = new Influx.InfluxDB(config);

module.exports = influx;
