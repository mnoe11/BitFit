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

      $urlRouterProvider.otherwise('home');
  }
]);


app.controller('mainCtrl', [
  '$scope',
  function($scope) {
  }
])
