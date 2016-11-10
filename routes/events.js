const CronJob = require('cron').CronJob;
// CronJobList, singleton

const express   = require('express');
const Router    = express.Router();
const influx    = require('../server/influxdb.js');
// const _         = require('lodash');

// const generateErrorHandler = function(res) {
//   return err => {
//     console.error(err);
//     res.status(500).json({error: true, data: err.message});
//   };
// };

class Job {
  constructor(influxClient) {
    this.jobList = {};
    this.influx = influxClient;
  }

  _insertRecord(measurementName, measurement) {
    // insert data to influx
    this.influx.writePoints([
      {
        measurement: measurementName,
        tags: measurement.tags,
        fields: measurement.fields
      }
    ]).catch((err) => {
      console.error(`Error saving data to InfluxDB! ${err.stack}`);
    });
  }

  add(options) {
    // validate the data of measurement
    // if it is correct, raise erroe

    const payload = {
      cronTime: '*/15 * * * * *',
      onTick: function() {
        this.insertRecord('load_testing', this.measurement);
      },
      timeZone: 'America/Los_Angeles',
      runOnInit: true,
      start: true,
      context: {measurement: options.measurement, insertRecord: this._insertRecord}
    };

    this.jobList[`${options.host}-${options.uuid}`] = {
      startedAt: options.startedAt,
      instance: new CronJob(payload)
    };
  }

  cancel(options) {
    this.jobList[`${options.host}-${options.uuid}`].instance.stop();
    this.jobList[`${options.host}-${options.uuid}`].stopedAt = new Date();
    this._insertRecord('load_testing_resulti', options.measurement);
  }
}

const job = new Job(influx);

Router.route('/apiv0.1/events/register')
.post((req, res) => {
  const data = req.body;

  // Generate uuid

  data.uuid = 'xxxx';

  // try job.add catch e, res.status(400).json({error: e})

  job.add(data);

  res.status(200).json({data: {uuid: data.uuid}});
});

Router.route('/apiv0.1/events/commit')
.get((req, res) => {
  const data = req.body;
  // stop job
  job.cancel(data);
  res.status(200).json({data: {'description': `The work of ad testing of host ${data.host} had been commited.`}});
});

module.exports = Router;
