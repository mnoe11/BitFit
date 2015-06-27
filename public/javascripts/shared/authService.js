var app = angular.module('bitFitAngularApp');

app.factory('authService', [
  '$http',
  '$rootScope',
  '$window',
  '$q',
  'TOKEN',
  function($http, $rootScope, $window, $q, TOKEN){
    var auth = {};
    var currentUser;

    auth.currentUser = function() {
      return currentUser;
    };
    // Will reload the $user
    auth.reloadCurrentUser = function(){

      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      $http.get('/user', {
                  headers: {
                    'Authorization': 'Bearer ' + auth.getToken()
                  },
                  params: {
                    username: payload.username
                  }
                })
          .success(function(data) {
            auth.saveUser(data.user);
          })
    };

    // Retrieves login token from local storage
    auth.getToken = function (){
      return $window.localStorage[TOKEN];
    };

    // Returns if the User is logged in
    auth.isLoggedIn = function(){
      var token = auth.getToken();

      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    // Logs the user in and saves the returned token in local storage
    auth.logIn = function(user){
      return $http.post('/login', user).success(function(data){
        auth.saveToken(data.token);
        auth.saveUser(data.user);
      });
    };

    // Removes the login token from local storage
    auth.logOut = function(){
      $window.localStorage.removeItem(TOKEN);
    };

    // Returns the Register api call
    // which will register the user
    // and save the resulting token in local storage
    auth.register = function(user){
      return $http.post('/register', user).success(function(data){
        auth.saveToken(data.token);
        auth.saveUser(data.user);
      });
    };

    // Stores login token in local storage
    auth.saveToken = function (token){
      $window.localStorage[TOKEN] = token;
    };

    // Saves the user
    auth.saveUser = function (user) {
      currentUser = user;
    }

    return auth;
  }]);
