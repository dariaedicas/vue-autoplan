var express = require('express');
var app = express();
var eventRoutes = express.Router();
// Require Item model in our routes module
var Event = require('../models/Event');
var moment = require('moment');
// Defined store route
eventRoutes.route('/add').post(function (req, res) {
  req.body.datetime = moment(req.body.datetime).add(req.body.period, 'days');
  var event = new Event(req.body);
  event.save()
    .then(event => {
      res.status(200).json({'event': 'Event added successfully'});
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
//TODO::and done today

eventRoutes.route('/').get(function (req, res) {

  var start = moment().startOf('day');
  var end = moment().endOf('day');
  Event.find( {
    $or: [
      {"datetime": {$lte: end}, "is_done": false},
      { $and : [ { datetime : {$lte: end, $gte: start} }, { is_done : true } ] }
    ]
  },
    function (err, events) {
      if (err) {
        console.log(err);
      }
      else {
        res.json(events);
      }
    }).sort({"datetime": 1});
});

// Defined edit route
eventRoutes.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Event.findById(id, function (err, event) {
    res.json(event);
  });
});

//  Defined update route
eventRoutes.route('/update/:id').post(function (req, res) {
  Event.findById(req.params.id, function (err, event) {
    if (!event)
      return next(new Error('Could not load Document'));
    else {
      event.description = req.body.description;
      event.period = req.body.period;
      event.datetime = req.body.datetime;
      event.save().then(event => {
        res.json('Update complete');
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
eventRoutes.route('/delete/:id').get(function (req, res) {
  Event.findByIdAndRemove({_id: req.params.id}, function (err, event) {
    if (err) res.json(err);
    else res.json('Successfully removed');
  });
});
//TODO::add period, done date
eventRoutes.route('/done/:id').post(function (req, res) {
  Event.findById({_id: req.params.id}, function (err, event) {
    if (!event)
      return next(new Error('Could not load Document'));
    else {
      event.is_done = req.body.is_done;
      event.datetime = new Date();
      event.save().then(event => {
        res.json('Update complete');
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});
  module.exports = eventRoutes;
