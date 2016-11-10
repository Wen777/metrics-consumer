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
      statistics_text: Influx.FieldType.STRING,
      failures_text: Influx.FieldType.STRING,
      sstatistics_requests: Influx.FieldType.INTEGER,
      statistics_failures: Influx.FieldType.INTEGER,
      statistics_median_response_time: Influx.FieldType.INTEGER,
      statistics_average_response_time: Influx.FieldType.INTEGER,
      statistics_min_response_time: Influx.FieldType.INTEGER,
      statistics_max_response_time: Influx.FieldType.INTEGER
    },
    tags: [
      'hostname',
      'method',
      'name',
      'mode'
    ]
  }
];

const influx = new Influx.InfluxDB(config);

module.exports = influx;
