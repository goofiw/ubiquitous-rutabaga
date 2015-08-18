var express = require('express');
var router = express.Router();

var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');
var nodemailer = require('nodemailer');
var secrets = require('../secrets');

var tokenGenerator = new FirebaseTokenGenerator(secrets.FIREBASE_SECRET);
var token = tokenGenerator.createToken({uid: "4", some: "randomdoberman", data: "ahhhh"});

var dataRef = new Firebase('https://startuphall.firebaseio.com');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/notify', function(req, res, next) {
  var id = req.body.memberId;
  var guestName = req.body.guestName;
  var message = req.body.message;

  var ref = new Firebase('https://startuphall.firebaseio.com/members/' + id);
    //send a slack if the member has a slack name
    //need to ohave username preceded by @
    if (ref.slack){
      request.post({url:'https://slack.com/api/chat.postMessage', 
          form: {
            token: secrets.SLACK_STARTUP_HALL,
            channel: ref.slack,
            test: 'Howdy, ' + guestName + ' is here to see you and is waiting in the lobby',
          }
        }, 
        function(err,httpResponse,body){ 
          if (err) {
            console.log(err);
          } else {
            console.log('slack messenge sent');
          }
        }
      );
    }

    //set up node mailer
    //sends from goofiw's automated mailer address
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'goofiwmailer@gmail.com',
        pass: 'secrets.MAIL_PASS'
      }
    });

    var mailOptions = {
      from: 'dev <goofiwmailer@gmail.com>',
      to: ref.name.concat(' <' + ref.email + '>'),
      subject: guestName.concat(' is here to see you'),
      text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Email Message sent: ' + info.response);
    });
});

module.exports = router;
