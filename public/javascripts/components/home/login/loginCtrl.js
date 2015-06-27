var app = angular.module('bitFitAngularApp');

app.controller('loginCtrl', [
  '$scope',
  '$state',
  'authService',
  function($scope, $state, authService) {
    $scope.showSignUp = false;

    $scope.confirmPassword = '';
    $scope.user = {};

    $scope.toggleLoginSignUp = function() {
      $scope.user = {};
      $scope.showSignUp = !$scope.showSignUp;
      $scope.error = null;
    }

    $scope.register = function(){
      if ($scope.confirmPassword != $scope.user.password) {
        $scope.error = {};
        $scope.error.message = 'Passwords must match';
        return;
      }
      authService.register($scope.user).error(function(error){
        $scope.error = error;
      }).then(function(){
        $state.go('home');
      });
    };

    $scope.logIn = function(){
      authService.logIn($scope.user).error(function(error){
        $scope.error = error;
      }).then(function(){
        $state.go('home');
      });
    };
  }
]);
