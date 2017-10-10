var Axios = require('axios')
const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  config = require('./config/DB'),
  eventRoutes = require('./expressRoutes/eventRoutes');

mongoose.Promise = global.Promise;
mongoose.connect(config.DB).then(
  () => {console.log('Database is connected') },
err => { console.log('Can not connect to the database'+ err)}
);

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());
app.use('/events', eventRoutes);
app.post('/auth/:provider', function(req, res){
    switch(req.params.provider) {
        case 'facebook':
            facebookAuth(req, res)
            break
    }
});
app.get('/info', function(req, res){
    Axios.get('https://graph.facebook.com/v2.4/me', {
        params: {
            access_token: req.body.accessToken,
            fields: 'id,name,short_name,name_format,first_name,middle_name,last_name,gender,email,verified,is_verified,cover,picture,timezone,currency,locale,age_range,updated_time,link,devices,is_shared_login,can_review_measurement_request',
        },
    }).then((response) => {
        if (response.status === 200 && !response.data.error) {
            return response.data;
        }
    }).catch(function (err) {
        res.status(500).json(err)
    })
});
function facebookAuth(req, res) {
    Axios.post('https://graph.facebook.com/v2.4/oauth/access_token', {
        client_id: 345616405903288,
        client_secret: '7fb06cdea879a3f9164f003691c70002',
        code: req.body.code,
        redirect_uri: req.body.redirectUri
    }, { 'Content-Type': 'application/json' }).then(function (response) {
        var responseJson = response.data
        res.json(responseJson)
    }).catch(function (err) {
        res.status(500).json(err)
    })
}

const port = process.env.PORT || 4000;

const server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});
