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
//TODO::get events for today

eventRoutes.route('/').get(function (req, res) {

  var start = moment().startOf('day');
  var end = moment().endOf('day');

  Event.find({"datetime": {$lte: start}, "is_done": false},
    function (err, events) {
      if (err) {
        console.log(err);
      }
      else {
        res.json(events);
      }
    });
});

// Defined edit route
eventRoutes.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Event.findById(id, function (err, event){
    res.json(event);
  });
});

//  Defined update route
eventRoutes.route('/update/:id').post(function (req, res) {
  Event.findById(req.params.id, function(err, event) {
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
  Event.findByIdAndRemove({_id: req.params.id}, function(err, event){
    if(err) res.json(err);
    else res.json('Successfully removed');
  });
});

module.exports = eventRoutes;
