angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $state, $localStorage,
  $ionicSideMenuDelegate, UserService) {
  $scope.signOut = function() {
    $ionicSideMenuDelegate.toggleLeft();
    UserService.logout();
    $state.go('home.login');
  }
}).
controller('LoginCtrl', function($state, $scope, UserService,
    UtilService) {
    $scope.loading = false;
    $scope.user = {
      userName: "",
      password: ""
    }
    $scope.login = function() {
      UtilService.showLoading();
      UserService.login($scope.user.userName, $scope.user.password).then((
        data) => {
        $state.go('techQuiz.quizlist');
      }, (status) => {
        UtilService.hideLoading();
        if (status = 401)
          UtilService.showAlert('Login Failed',
            'Please enter valid credintials');
        else {
          UtilService.showAlert('Login Failed',
            'Oops! something went wrong');
        }
      })
    }
  })
  .controller('SignupCtrl', function($scope, $state, UserService, UtilService) {
    $scope.regForm = {
      username: "",
      password: "",
      email: ""
    }
    $scope.signup = function() {
      UtilService.showLoading();
      UserService.signup($scope.regForm).then((
        data) => {
        $state.go('techQuiz.quizlist');
      }, (status) => {
        UtilService.hideLoading();
        UtilService.showAlert('Signup Failed',
          'Oops! something went wrong');
      })
    }
  })
  .controller('QuizListCtrl', function($scope, $state, QuizService, UtilService) {
    UtilService.showLoading();
    $scope.data = {
      quizList: [],
      searchText: ""
    };
    QuizService.getQuizList().then((data) => {
      $scope.data.quizList = [...data];
      console.log($scope.data.quizList);
      UtilService.hideLoading();
    }, (status) => {
      UtilService.hideLoading();
      UtilService.showAlert('Not able to fetch data',
        'Oops! something went wrong');
    });
    $scope.takeQuiz = function(id) {
      console.log(id);
      $state.go('quiz', {
        id: id
      })
    }
  })
  .controller('QuizCtrl', function($state, $scope, $ionicPopup, $stateParams,
    QuizService,
    UtilService) {
    $scope.quizData = {};
    $scope.question = {};
    $scope.data = {
      choice: null,
      answers: []
    };
    UtilService.showLoading();
    console.log($stateParams.id);
    $scope.nextQuestion = function() {
      $scope.data.choice = null;
      var curQ = $scope.question.currentQuestion;
      $scope.question = $scope.quizData.questionList[curQ + 1];
      $scope.question.currentQuestion = curQ + 1;
    }
    $scope.getResult = function() {
      var marks = 0;
      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirm',
        template: 'Are you sure you want to Submit?'
      });
      confirmPopup.then(function(res) {
        if (res) {
          $scope.data.answers.forEach((data) => {
            if (data.answer == true)
              marks++;
          });
          QuizService.uploadResults($scope.quizData._id, marks);
          var alertPopup = $ionicPopup.alert({
            title: 'Your Result!',
            template: `You got ${marks} Out of ${$scope.quizData.questionList.length}`
          });
          alertPopup.then(function(res) {
            $state.go('techQuiz.quizlist');
          });
        } else {
          console.log('You are not sure');
        }
      });
    }
    $scope.checkforanswer = function() {
      var alreadyAnswered = $scope.data.answers.filter((data) => {
        return data.qid == $scope.question.currentQuestion;
      }).length > 0;
      if (alreadyAnswered) {
        $scope.data.answers = $scope.data.answers.map((data) => {
          console.log(data.qid);
          console.log($scope.question.currentQuestion);
          if (data.qid == $scope.question.currentQuestion) {
            data.answer = $scope.question.question.Options[$scope.data.choice]
              .isCorrectAnswer;
          }
          return data;
        });
      } else {
        $scope.data.answers.push({
          qid: $scope.question.currentQuestion,
          answer: $scope.question.question.Options[$scope.data.choice].isCorrectAnswer
        });
      }
    }
    QuizService.getQuizById($stateParams.id).then((data) => {
      $scope.quizData = data;
      $scope.question = $scope.quizData.questionList[0];
      $scope.question.currentQuestion = 0;
      console.log($scope.question);
      UtilService.hideLoading();
    }, (status) => {
      UtilService.hideLoading();
      UtilService.showAlert('Not able to fetch data',
        'Oops! something went wrong');
    });
  })
  .controller('ResultCtrl', function($scope, QuizService, UtilService) {
    UtilService.showLoading();
    $scope.data = {
      results: [],
    };
    QuizService.getResults().then((data) => {
      console.log(data)
      $scope.data.results = [...data[0].results];
      console.log($scope.data.results);
      UtilService.hideLoading();
    }, (status) => {
      UtilService.hideLoading();
      UtilService.showAlert('Not able to fetch data',
        'Oops! something went wrong');
    });
  });
