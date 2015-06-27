var app = angular.module('bitFitAngularApp');

app.controller('homeCtrl', [
  '$scope',
  '$state',
  'authService',
  'githubService',
  function($scope, $state, authService, githubService){
    $scope.displayGithubFeed = true;

    $scope.toggleView = function() {
      $scope.displayGithubFeed = !$scope.displayGithubFeed;
    }

    $scope.logout = function() {
      authService.logOut();
    }

    $scope.saveChanges = function() {
      authService.saveUserChanges($scope.user).then(function(results) {
        console.log(results);
      })
    }

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

                  $scope.numberMonthlyCommits = $scope.commits.filter(function (commit) {
                    var currentMonth = new Date().getMonth();
                    var commitMonth = new Date(commit.created_at).getMonth();
                    return currentMonth == commitMonth;
                  }).length;

                });
        }
      }
    )
  }
]);
