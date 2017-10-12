var express = require('express');
var router = express.Router();
var passportFb = require('../auth/facebook');
var serveConfig=require('../../config/server-config');
router.get('/auth/facebook', passportFb.authenticate('facebook'));

router.get('/auth/facebook/callback',
    passportFb.authenticate('facebook',
        { successRedirect: serveConfig.CLIENT_URL+'/#/',
            failureRedirect: serveConfig.CLIENT_URL+'/login'}),
    function(req, res) {
        // Successful authentication
        res.json(req.user);
    });


module.exports = router;
