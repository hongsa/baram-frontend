(function () {
  'use strict';
  function Home($http, $q, $rootScope, APP_CONFIG) {
    return {
      signUp: signUp,
      logIn: logIn,
      signOut: signOut
    };
    function signUp(signUpData) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'users/signup',
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        data: signUpData
      }).then(function (response) {
        console.log(response)
        var tmp = {};
        tmp.id = response.data.id;
        tmp.gameName = response.data.game_name;
        tmp.token = response.data.token;
        window.localStorage.user = JSON.stringify(tmp);
        deferred.resolve({
          code: response.status,
          msg: response.data.msg
        });
      }, function (err) {
        deferred.resolve({
          code: err.status,
          msg: err.data.msg
        });
      }, deferred.reject);
      return deferred.promise;
    }
    function logIn(logInData) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'users/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        data: logInData
      }).then(function (response) {
        console.log(response)
        var tmp = {};
        tmp.id = response.data.id;
        tmp.gameName = response.data.game_name;
        tmp.token = response.data.token;
        window.localStorage.user = JSON.stringify(tmp);
        deferred.resolve({
          code: response.status,
          msg: response.data.msg
        });
      }, function (err) {
        deferred.resolve({
          code: err.status,
          msg: err.data.msg
        });
      }, deferred.reject);
      return deferred.promise;
    }
    function signOut() {
      $rootScope.user = undefined;
      $rootScope.isLoggedIn = false;
      try {
        window.localStorage.user = undefined;
      } catch (e) {
      }
      $rootScope.$broadcast('signOut', 'success');
    }
  }
  Home.$inject = [
    '$http',
    '$q',
    '$rootScope',
    'APP_CONFIG'
  ];
  angular.module('baram.home.service.Home', []).factory('Home', Home);
}());