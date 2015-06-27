var app = angular.module('bitFitAngularApp', ['ui.router']);


app.config([
  '$stateProvider',
  '$urlRouterProvider',
  'PATHS',
  function($stateProvider, $urlRouterProvider, PATHS) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: PATHS.HOME + '/home.html',
        controller: 'homeCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: PATHS.HOME + '/login/login.html',
        controller: 'loginCtrl'
      })

      $urlRouterProvider.otherwise('home');
  }
]);


app.controller('mainCtrl', [
  '$scope',
  '$state',
  '$location',
  'authService',
  function($scope, $state, $location, authService) {

    if (authService.isLoggedIn()) {
      $state.go('home');
    }
    else {
      $location.path('login');
    }
  }
])
