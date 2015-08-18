var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var r = require('rethinkdb');
var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');
var nodemailer = require('nodmailer');
var secrets = require('./secrets');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// var connection = null;
// r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
//     if (err) throw err;
//     connection = conn;
// })

// r.db('test').tableCreate('authors').run(connection, function(err, result) {
//     if (err) throw err;
//     console.log(JSON.stringify(result, null, 2));
// })


var tokenGenerator = new FirebaseTokenGenerator(secrets.FIREBASE_SECRET);
var token = tokenGenerator.createToken({uid: "4", some: "randomdoberman", data: "ahhhh"});

var dataRef = new Firebase('https://startuphall.firebaseio.com');

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'goofiwmailer@gmail.com',
      pass: 'secrets.MAIL_PASS'
    }
  });

  var mailOptions = {
    from: 'dev <goofiwmailer@gmail.com>',
    to: 'will <will@willchantry.com>',
    subject: 'test',
    text: 'test',
    html: '<b>test</b>'
  };

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
})


module.exports = app;
