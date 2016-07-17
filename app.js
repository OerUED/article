var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var config = require('./config');

global.basename = __dirname;


var routes = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(session({
    secret: config.cookieSecret,
    store: new MongoStore({
        db: config.db,
        url: 'mongodb://'+ config.host +'/' + config.cookieSecret
    }),
     resave: true,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin',req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials',true);
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,X_Requested_With,accept,DEVICE_ID,content-type');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,DELETE,PUT');
  next();
});

require('./routes')(app);

app.use(bodyParser.json());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status);
  res.send(err);
});


module.exports = app;

console.log('website started!');
