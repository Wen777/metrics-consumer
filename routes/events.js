const CronJob = require('cron').CronJob;
// CronJobList, singleton

const express   = require('express');
const Router    = express.Router();
const influx    = require('../server/influxdb.js');
const _         = require('lodash');

const generateErrorHandler = function(res) {
  return err => {
    console.error(err);
    res.status(500).json({error: true, data: err.message});
  };
};


class Job {
  constructor(influx) {
    this.jobList = {};
    this.influx = influx;
  }

  _insertRecord(measurement) {
    const targetHost = measurement.targetHost;
    delete measurement.targetHost;
  const data = _.map(measurement, function(item) {
      return {measurement: item, tags:{host:item.targetHost}, fields:}
})
    // insert data to influx
    this.influx.writePoints([
    ]).catch((err) => {
      console.error(`Error saving data to InfluxDB! ${err.stack}`);
    });
  }

  add(options) {
    const payload = {
      cronTime: '*/15 * * * * *',
      onTick: function() {
        this.insertRecord(this.measurement);
      },
      timeZone:'America/Los_Angeles',
      runOnInit: true,
      start: true,
      context: {measurement: options.measurement, insertRecord: this._insertRecord}
    }

    const cronjob = new CronJob(payload);

    this.jobList[`${options.host}-${options.uuid}`] = {
      start: options.time,
      instance: new CronJob(payload)
    };
  }

  cancel(options) {
    this.jobList[`${options.host}-${options.uuid}`].instance.stop();
    this.jobList[`${options.host}-${options.uuid}`].stopedAt = new Date();
  }
}

const job = new Job(influx);

Router.route('/apiv0.1/events/register')
.post((req, res) => {
  const errorHandler = generateErrorHandler(res);
  let data = req.body;

  // add job
  job.add(data);

  // db.Pool.addPool(req.body)
  //   .then(function(data) {
  //     res.status(200).json({error: false, data: data});
  //   })
  //   .catch(errorHandler);
});

Router.route('/apiv0.1/events/commit')
.get(function(req, res) {
  const errorHandler = generateErrorHandler(res);

  //stop job

})
// .get(function(req, res) {
//   const errorHandler = generateErrorHandler(res);
//   const data = {
//     coin: req.query.coin
//   };
//
//   // db.Pool.queryPools(data)
//   //   .then(function(result) {
//   //     res.status(200).json({error: false, data: result});
//   //   })
//   //   .catch(errorHandler);
// })

module.exports = Router;
