var app = angular.module('bitFitAngularApp');

app.controller('homeCtrl', [
  '$scope',
  '$state',
  'authService',
  function($scope, $state, authService){

    $scope.isLoggedIn = authService.isLoggedIn;

  }
]);
