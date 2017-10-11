var express = require('express');
var router = express.Router();
var passportFb = require('../auth/facebook');

router.get('/auth/facebook', passportFb.authenticate('facebook'));

router.get('/auth/facebook/callback',
    passportFb.authenticate('facebook',
        { successRedirect: 'http://localhost:8080/#/',
            failureRedirect: 'http://localhost:8080/login'}),
    function(req, res) {
        // Successful authentication
        res.json(req.user);
    });


module.exports = router;
