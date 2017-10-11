var express = require('express');
var eventRoutes = express.Router();
// Require Item model in our routes module
var Event = require('../models/Event');
var moment = require('moment');

// Defined store route
eventRoutes.route('/add').post(function (req, res) {
  var event = new Event(req.body);
  event.user_id = req.user._id;
  event.save()
    .then(event => {
      res.status(200).json({'event': 'Event added successfully'});
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});
eventRoutes.route('/future').get(function (req, res) {
  var end = moment().endOf('day');
  Event.find({"datetime": {$gt: end}, user_id: req.user._id},
    function (err, events) {
      if (err) {
        console.log(err);
      }
      else {
        res.json(events);
      }
    }).sort({"datetime": 1});
});
eventRoutes.route('/').get(function (req, res) {
  var end = moment().endOf('day');
  Event.find({"datetime": {$lte: end}, is_done: false, user_id: req.user._id},
    function (err, events) {
      if (err) {
        console.log(err);
      }
      else {
        res.json(events);
      }
    }).sort({"datetime": 1});
});

//  Defined update route
eventRoutes.route('/update/:id').post(function (req, res) {
  Event.findById(req.params.id, function (err, event) {
    if (!event)
      return next(new Error('Could not load Document'));
    else {
      event.title = req.body.title;
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
    if (err) {
        res.json(err);
    }
    else {
        res.json('Successfully removed');
    }
  });
});
eventRoutes.route('/done/:id').post(function (req, res) {
  Event.findById({_id: req.params.id}, function (err, event) {
    if (!event)
      return next(new Error('Could not load Document'));
    else {
      if(req.body.period > 0){
        event.datetime = moment(req.body.done_datetime).add(req.body.period, 'days');
      } else{
        event.datetime = moment(req.body.done_datetime);
        event.is_done = true;
      }
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
