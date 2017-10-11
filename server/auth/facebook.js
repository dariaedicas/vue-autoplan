var passport = require('passport');
var FbStrategy = require('passport-facebook').Strategy;

var User = require('../models/User');
var config = require('../social-config');
var init = require('./init');

passport.use(new FbStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        var searchQuery = {
            name: profile.displayName
        };

        var updates = {
            name: profile.displayName,
            someID: profile.id
        };

        var options = {
            upsert: true
        };

        // update the user if s/he exists or add a new user
        User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
            if(err) {
                return done(err);
            } else {
                return done(null, user);
            }
        });
    }

));

// serialize user into the session
init();


module.exports = passport;