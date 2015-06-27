var app = angular.module('bitFitAngularApp');

app.factory('githubService', [
  '$http',
  '$q',
  '$rootScope',
  'authService',
  function($http, $q, $rootScope, authService){
    var githubFactory = {};
    var githubEndpoint = "https://api.github.com/";

    // Will reload the $rootScope.user
    githubFactory.getCurrentUserRecentActivity = function(githubHandle){
      var deferred = $q.defer();
      var getEndpoint = githubEndpoint + 'users/'
                        + githubHandle + '/events';
      $http.get(getEndpoint)
           .success(function(resp) {
             deferred.resolve(resp);
           })
           .error(function(err) {
             deferred.reject(err);
           });

      return deferred.promise;

    };

    return githubFactory;
  }]);
