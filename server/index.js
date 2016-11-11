'use strict';

const express     = require('express');
const env         = process.env.NODE_ENV || 'development';
const config      = require(__dirname + '/../config/api.json')[env];
const bodyParser  = require('body-parser');
const influx      = require('./influxdb');
const app         = express();

// Routers
const eventsRoute = require('../routes/events');

// Midleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Add headers
app.use(function(req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    // Pass to next layer of middleware
  }
  next();
});

// Set up route
app.use(eventsRoute);

app.get('/apiv0.1/ping', function(req, res) {
  res.status(200).json({
    'res': 'PONG!'
  });
});

influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('telegraf')) {
      return influx.createDatabase('telegraf');
    }

    return {names: names};
  })
  .then(() => {
    app.listen(config.port, config.host, function() {
      console.log('Server listening on %s:%d', config.host, config.port);
    });
  })
  .catch(err => {
    console.error(`Error creating Influx database!
${err}`);
  });

// export default app;
module.exports = app;
