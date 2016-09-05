var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');

router.get('/', function(req, res, next) {
  res.json({
    title: 'Welcome in tech Quiz'
  });
});

router.post('/login', (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Please fill out all fields'
    });
  }
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log(err);
      return next(err)
    }
    if (user) {
      return res.json({
        token: user.generateJWT()
      });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.post('/signup', (req, res, next) => {
  if (!req.body.username || !req.body.password || !req.body.email) {
    return res.status(400).json({
      message: 'Please fill out all fields'
    });
  }
  var user = new User();
  user.userName = req.body.username;
  user.password = req.body.password;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save((err) => {
    if (err) {
      console.log(err)
      return next(err);
    }

    res.json({
      token: user.generateJWT()
    });
  });
});

router.param('userName', (req, res, next, userName) => {
  User.find({
    userName: userName
  }, (err, user) => {
    if (err) return next(err);
    if (user.length > 0)
      req.isUserNameExist = true;
    else {
      req.isUserNameExist = false;
    }
    next();
  });
})
router.get('/verifyusername/:userName', (req, res, next) => {
  res.json({
    isUserNameExist: req.isUserNameExist
  });
});
/**/
router.param('email', (req, res, next, email) => {
  User.find({
    email: email
  }, (err, user) => {
    if (err) return next(err);
    if (user.length > 0)
      req.isEmailExist = true;
    else {
      req.isEmailExist = false;
    }
    next();
  });
})
router.get('/verifyemail/:email', (req, res, next) => {
  res.json({
    isEmailExist: req.isEmailExist
  });
});
module.exports = router;
/*
Category.find()
.populate('questionList.question level questionList.question.category')
.exec(function (err, person) {
if (err) {
console.log(err);
return next(err);}
res.json(person);
})
*/
