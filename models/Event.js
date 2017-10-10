var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO::add validation rules
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
  },
    user_id:{
        type: Number
    }
},{
  collection: 'events'
});

module.exports = mongoose.model('Event', Event);
