var app = angular.module('bitFitAngularApp');


app.directive('loginDirective', [
  'PATHS',
  'authService',
  function(PATHS) {
    return {
      restrict: 'E',
      templateUrl: PATHS.HOME + 'login/login.html',
      $scope: {},
      controller: function($scope, $state, authService) {

        $scope.showSignUp = false;
        $scope.user = {};

        $scope.toggleLoginSignUp = function() {
          $scope.user = {};
          $scope.showSignUp = !$scope.showSignUp;
        }

        $scope.register = function(){
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
    }
}])
