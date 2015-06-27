var app = angular.module('bitFitAngularApp');

app.controller('homeCtrl', [
  '$scope',
  '$state',
  'authService',
  'githubService',
  function($scope, $state, authService, githubService){

    $scope.$watch(function() { return authService.currentUser(); },
      function(newValue, oldValue) {
        if (newValue) {
          $scope.user = authService.currentUser();

          githubService.getCurrentUserRecentActivity($scope.user.githubHandle)
                .then(function(results) {
                  // Filters so that only Commits (PushEvents) are returned
                  $scope.commits = results.filter(function (commit) {
                    return commit.type == "PushEvent";
                  });
                });
        }
      }
    )
  }
]);
