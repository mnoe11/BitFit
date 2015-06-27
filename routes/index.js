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
     !req.body.githubHandle ||
     !req.body.monthlyCommitGoal ||
     !req.body.myBitcoinAddress ||
     !req.body.destinationBitcoinAddress ||
     !req.body.satoshiPenaltyAmount) {
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  // Checks to see if a User already has that username
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) { return done(err); }

    if (!user) {
      var user = new User();

      user.username = req.body.username;
      user.githubHandle = req.body.githubHandle;
      user.monthlyCommitGoal = req.body.monthlyCommitGaol;
      user.myBitcoinAddress = req.body.myBitcoinAddress;
      user.destinationBitcoinAddress = req.body.destinationBitcoinAddress;
      user.satoshiPenaltyAmount = req.body.satoshiPenaltyAmount;

      user.setPassword(req.body.password)

      user.save(function (err){
        if(err){ return next(err); }

        return res.json({ token: user.generateJWT(), user: user })
      });

    }
    else {
      return res.status(400).json({message: 'Username already taken.'})
    }

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
      return res.json({ token: user.generateJWT(), user: user });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.get('/user', auth, function(req, res, next) {
  if (!req.payload.username) {
    return res.status(400).json({ message: 'Must supply username' });
  }

  // Checks to see if a User already has that username
  User.findOne({ username: req.payload.username }, function (err, user) {
    if (err) { return done(err); }

    if (!user) {
        return res.status(400).json({ message: 'User with that username does not exist' });
    }
    else {
      return res.json({ user: user });
    }

  });

  })
  .post('/user', auth, function(req, res, next) {
    var userParam = req.body.user;
    if (!userParam || !userParam.username || !userParam.githubHandle ||
        !userParam.monthlyCommitGoal || !userParam.myBitcoinAddress ||
        !userParam.satoshiPenaltyAmount) {
      return res.status(400).json({ message: 'Invalid parameters.' });
    }
    else {
      User.findOne({ username: userParam.username }, function (err, user) {
        if (err) { return done(err); }

        if (!user) {
          return res.status(400).json({ message: 'User with that username does not exist' });
        }
        else {
          user.monthlyCommitGoal = userParam.monthlyCommitGoal;
          user.myBitcoinAddress = userParam.myBitcoinAddress;
          user.destinationBitcoinAddress = userParam.destinationBitcoinAddress;
          user.satoshiPenaltyAmount = userParam.satoshiPenaltyAmount;

          user.save(function (err){
            if(err){ return next(err); }

            return res.json({ token: user.generateJWT(), user: user })
          });
        }
      })
    }
  })


module.exports = router;
