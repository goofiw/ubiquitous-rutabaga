var express = require('express');
var router = express.Router();

var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');

var nodemailer = require('nodemailer');

var cfg = require('envigor')();

var tokenGenerator = new FirebaseTokenGenerator(cfg.firebase.secret);
var token = tokenGenerator.createToken({uid: "4", some: "randomdoberman", data: "ahhhh"});




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/notify', function(req, res, next) {
  var id = req.body.memberId;
  var guestName = req.body.guestName;
  var message = req.body.message;

  var dataRef = new Firebase('https://startuphall.firebaseio.com/members/' + id);
  dataRef.on('value', function(snapshot){
    var ref = snapshot.val();
      console.log(ref);
    //send a slack if the member has a slack name
    //need to ohave username preceded by @

    if (ref.slack){

      request.post({url:'https://slack.com/api/chat.postMessage',
          form: {
            token: cfg.env.SLACK_STARTUP_HALL,
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
        pass: cfg.smtp.password
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
  })

});

module.exports = router;
