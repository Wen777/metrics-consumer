const _         = require('lodash');
const CronJob   = require('cron').CronJob;
const express   = require('express');
const Router    = express.Router();
const influx    = require('../server/influxdb');
const Random    = require('meteor-random');

// const generateErrorHandler = function(res) {
//   return err => {
//     console.error(err);
//     res.status(500).json({error: true, data: err.message});
//   };
// };

class Job {
  constructor() {
    this.jobList = {};
  }

  _insertRecord(measurementName, measurement) {
    // insert data to influx
    if (measurementName === 'load_testing_result') {
      measurement.fields.requestStats = JSON.stringify(measurement.fields.requestStats);
    }
    const data = [{
        measurement: measurementName,
        tags: measurement.tags,
        fields: measurement.fields
      }];

    return influx.writePoints(data).catch((err) => {
      console.error(`Error saving data to InfluxDB! ${err.stack}`);
    });
  }

  list() {
    return _.mapValues(this.jobList, 'instance.running');
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
    // startedAt: in python and nodejs is 1000 times different.
    this.jobList[`${options.hostname}-${options.uuid}`] = {
      startedAt: options.startedAt,
      instance: new CronJob(payload)
    };
  }

  cancel(options) {
    if(!_.includes(Object.keys( this.jobList), `${options.hostname}-${options.uuid}`)) {return;}
    this.jobList[`${options.hostname}-${options.uuid}`].instance.stop();
    this.jobList[`${options.hostname}-${options.uuid}`].stopedAt = new Date();
    this._insertRecord('load_testing_result', options.measurement);
  }
}

const job = new Job();

Router.route('/apiv0.1/events/isrunning')
.get((req, res) => {
  res.status(200).json(job.list());
});

Router.route('/apiv0.1/events/register')
.post((req, res) => {
  const data = req.body;

  // Generate uuid
  data.uuid = Random.id(17);

  // try job.add catch e, res.status(400).json({error: e})
  job.add(data);

  res.status(200).json({data: {uuid: data.uuid}});
});

Router.route('/apiv0.1/events/commit')
.post((req, res) => {
  const data = req.body;
  // stop job
  job.cancel(data);
  res.status(200).json({data: {'description': `The work of ad testing of host ${data.targetHost} had been commited.`}});
});

module.exports = Router;
