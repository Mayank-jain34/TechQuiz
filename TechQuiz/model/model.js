var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  categoryName : {type: String, lowercase: true, unique: true},
});
var levelSchema = new Schema({
  difficulty : {type : String ,lowercase : true ,unique:true}
});
var questionSchema = new Schema({
    Q : String,
    category : {type : mongoose.Schema.Types.ObjectId,ref : 'Category'},
    Options :[{
          Option : String,
          isCorrectAnswer : Boolean
          }]
});
var quizSchema = new Schema({
  title : String,
  noOfQuestion : Number,
  level :  {type : mongoose.Schema.Types.ObjectId,ref : 'Level'},
  questionList : [
    {question :  {type : mongoose.Schema.Types.ObjectId,ref : 'Question'}}
  ]
});

mongoose.model('Category',categorySchema,'Category');
mongoose.model('Level',levelSchema,'Level');
mongoose.model('Question',questionSchema,'Question');
mongoose.model('Quiz',quizSchema,'Quiz');
