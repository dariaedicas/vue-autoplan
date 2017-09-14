var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var Event = new Schema({
  description: {
    type: String
  },
  period: {
    type: Number
  },
  datetime: {
    type: Date
  }
},{
  collection: 'events'
});

module.exports = mongoose.model('Event', Event);
