const express = require('express'),
  path = require('path'),
    cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  config = require('../config/DB'),
  eventRoutes = require('./expressRoutes/eventRoutes');
var session = require('express-session');
var passport = require('passport');
var routes = require('./expressRoutes/index.js');
var auth = require('./middleware/auth');
mongoose.Promise = global.Promise;
mongoose.connect(config.DB).then(
  () => {console.log('Database is connected') },
err => { console.log('Can not connect to the database'+ err)}
);

const app = express();
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: 'http://localhost:8080'}));
app.use(session({
    secret: 'k76hgj021hh3k24k3f5',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/events', auth.isAuthenticated, eventRoutes);
app.use('/', routes);
const port = process.env.PORT || 4000;

const server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});
