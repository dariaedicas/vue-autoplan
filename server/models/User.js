var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var User = new Schema({
    name: String,
    someID: String
},{
    collection: 'users'
});


module.exports = mongoose.model('User', User);