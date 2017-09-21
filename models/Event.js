var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var Event = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  period: {
    type: Number
  },
  datetime: {
    type: Date
  },
  is_done: {
    type: Boolean, default: false
  }
},{
  collection: 'events'
});

module.exports = mongoose.model('Event', Event);
