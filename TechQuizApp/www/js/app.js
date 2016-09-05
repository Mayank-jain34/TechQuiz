// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services',
  'ngStorage'
])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins
        .Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl',
        abstract: true
      })
      .state('home.signup', {
        url: "/signup",
        views: {
          'home-signup': {
            templateUrl: "templates/signup.html",
            controller: 'SignupCtrl'
          }
        }
      })
      .state('home.login', {
        url: "/login",
        views: {
          'home-login': {
            templateUrl: "templates/login.html",
            controller: 'LoginCtrl'
          }
        }
      })
      .state('techQuiz', {
        url: '/quiz',
        templateUrl: 'templates/techQuiz-tabs.html',
        abstract: true,
        controller: 'HomeCtrl'
      })
      .state('techQuiz.quizlist', {
        url: "/quizlist",
        views: {
          'quiz-list': {
            templateUrl: "templates/quizlist.html",
            controller: 'QuizListCtrl'
          }
        }
      })
      .state('techQuiz.results', {
        url: "/results",
        views: {
          'quiz-results': {
            templateUrl: "templates/results.html",
            controller: 'ResultCtrl'
          }
        }
      })
      .state('techQuiz.about', {
        url: "/about",
        views: {
          'about': {
            templateUrl: "templates/about.html",
            controller: 'HomeCtrl'
          }
        }
      }).
    state('quiz', {
      url: "/quiz/:id",
      templateUrl: "templates/quiz.html",
      controller: 'QuizCtrl'
    });
    $urlRouterProvider.otherwise('/home/login');
  });
