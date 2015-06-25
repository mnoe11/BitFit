var app = angular.module('bitFitAngularApp', ['ui.router']);


app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
      })

      $urlRouterProvider.otherwise('home');
  }
]);


app.controller('MainCtrl', [
'$scope',
function($scope, posts){

}]);
