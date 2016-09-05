const API_URL = "http://localhost:8234/"
angular.module('starter.services', [])
  .factory('UserService', function($localStorage, $http, $q) {
    var o = {};
    o.isUserloggedIn = function() {
      if ($localStorage.TechQuizToken) {
        return true;
      }
      return false;
    };
    o.getToken = function() {
      return $localStorage.TechQuizToken;
    }
    o.setToken = function(token) {
      $localStorage.TechQuizToken = token;
      return;
    }
    o.logout = function() {
      o.setToken(null);
    }
    o.login = function(userName, password) {
      var defer = $q.defer();
      $http.post(API_URL + 'login', {
        username: userName,
        password: password
      }).then((response) => {
        o.setToken(response.data.token);
        defer.resolve(response.data)
      }, (response) => {
        defer.reject(response.status)
      });
      return defer.promise;
    };
    o.signup = function(regForm) {
      var defer = $q.defer();
      $http.post(API_URL + 'signup', {
        username: regForm.username,
        password: regForm.password,
        email: regForm.email
      }).then((response) => {
        o.setToken(response.data.token);
        defer.resolve(response.data)
      }, (response) => {
        defer.reject(response.status)
      });
      return defer.promise;
    };
    return o;
  })
  .factory('QuizService', function($http, $q, UserService) {
    var o = {};
    o.getQuizList = function() {
      var defer = $q.defer();
      $http.get(API_URL + 'quizzes', {
          headers: {
            Authorization: 'Bearer ' + UserService.getToken()
          }
        })
        .then((response) => {
          console.log(response.data);
          defer.resolve(response.data);
        }, (response) => {
          defer.reject(response.status)
        });
      return defer.promise;
    };
    o.getQuizById = function(id) {
      var defer = $q.defer();
      $http.get(API_URL + 'quizzes/quiz/' +
          id, {
            headers: {
              Authorization: 'Bearer ' + UserService.getToken()
            }
          })
        .then((response) => {
          console.log(response)
          defer.resolve(response.data);
        }, (response) => {
          defer.reject(response.status)
        });
      return defer.promise;
    }
    o.uploadResults = function(id, marks) {
      var defer = $q.defer();
      $http.post(API_URL + 'quizzes/uploadresult/', {
        qid: id,
        marks: marks
      }, {
        headers: {
          Authorization: 'Bearer ' + UserService.getToken()
        }
      }).then((response) => {
        console.log(response);
        defer.resolve(response.status)
      }, (response) => {
        console.log(response);
        defer.reject(response.status)
      });
      return defer.promise;
    }
    o.getResults = function() {
      var defer = $q.defer();
      $http.get(API_URL + 'quizzes/results/', {
        headers: {
          Authorization: 'Bearer ' + UserService.getToken()
        }
      }).then((response) => {
        console.log(response);
        defer.resolve(response.data)
      }, (response) => {
        console.log(response);
        defer.reject(response.status)
      });
      return defer.promise;
    }
    return o;
  })
  .factory('UtilService', function($ionicLoading, $ionicPopup) {
    var o = {};
    o.showLoading = function() {
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>',
        hideOnStateChange: true
      }).then(function() {
        console.log("The loading indicator is now displayed");
      });
    }
    o.hideLoading = function() {
      $ionicLoading.hide().then(function() {
        console.log("The loading indicator is now hidden");
      });
    }
    o.showAlert = function(title, template) {
      $ionicPopup.alert({
        title,
        template
      }).then(function(res) {
        console.log(
          'Alert Executed');
      });
    }
    return o;
  });
