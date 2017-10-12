var conf = require('../config/server-config');
/*config for test*/
var ids = {
    facebook: {
        clientID: '2013240272255545',
        clientSecret: '8e56947a4f7f67177c8d6a499556075c',
        callbackURL: conf.API_URL + "auth/facebook/callback"
    }
};


module.exports = ids;
