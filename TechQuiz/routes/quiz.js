var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'TECHQUIZ',
  userProperty: 'payload'
});
var mongoose = require('mongoose');

var Quiz = mongoose.model('Quiz');
var User = mongoose.model('User');
router.get('/', auth, (req, res, next) => {
  console.log(req.payload);
  Quiz.find().populate("level").select({
    "title": 1,
    "level": 1,
    "noOfQuestion": 1
  }).exec((err, quiz) => {
    if (err) return next(err);
    res.json(quiz)
  });
});

router.param('qid', (req, res, next, qid) => {
  console.log(qid);
  Quiz.findOne({
    _id: qid
  }).populate("questionList.question").exec((err, quiz) => {
    if (err) {
      console.log(err);
      return next(err)
    };
    console.log(quiz);
    req.quiz = quiz;
    next();
  })
});
router.get('/quiz/:qid', auth, (req, res, next) => {
  console.log("here");
  res.json(req.quiz);
});
router.post('/uploadresult', auth, (req, res, next) => {
  var userName = req.payload.userName;
  User.findOne({
    userName: userName
  }, (err, user) => {
    if (err) {
      console.log(err);
      return next(err)
    }
    console.log(user)
    user.results.push({
      quizSet: req.body.qid,
      marks: req.body.marks,
    });
    user.save((err, user) => {
      if (err) {
        console.log(err);
        return next(err)
      }
      res.json(user);
    });
  });
});
router.get('/results', auth, (req, res, next) => {
  User.find({
    userName: req.payload.userName
  }, {
    'results': 1,
    'marks': 1
  }).populate('results.quizSet').exec((err, user) => {
    if (err) {
      console.log(err);
      return next(err)
    }
    res.json(user);
  });
})
module.exports = router;
