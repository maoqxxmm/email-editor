var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var vm = require('express-velocity');
var hbs = require('hbs');
var config = require('./configs/config');

var routes = require('./routes/index');

var app = express();

app.smtpTransport = nodemailer.createTransport(config.mail);

app.set('view engine', 'hbs');

app.set("views", __dirname + "/build")
app.set("views", __dirname + "/views")

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets/images/email')));

routes(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err)
  res.send(err.message)
});


module.exports = app;
