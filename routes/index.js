var express = require('express');
var jwt = require('express-jwt');
var mongoose = require('mongoose');
var passport = require('passport');

var User = mongoose.model('User');

var router = express.Router();

var auth = jwt({ secret: process.env.JWT_SECRET, userProperty: 'payload' });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

router.post('/register', function(req, res, next){
  if(!req.body.username ||
     !req.body.password ||
     !req.body.githubHandle) {
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  console.log('Registering user!');

  var user = new User();

  user.username = req.body.username;
  user.githubHandle = req.githubHandle;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  // Calls the LocalStrategy authentication created in app.js
  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
