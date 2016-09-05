var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new Schema({
  userName: {type: String, lowercase: true, unique: true},
  email : {type: String,lowercase: true, unique:true},
  salt : String,
  hash : String,
  password : String,
  results : [ {quizSet : { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
              marks : Number
            }]
});
userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}
userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};
userSchema.methods.generateJWT = function(){
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate()+60);
  return jwt.sign({
    _id:this._id,
    userName : this.userName,
    exp : parseInt(exp.getTime() / 1000)
  },'TECHQUIZ');
}

mongoose.model('User',userSchema,'User');
