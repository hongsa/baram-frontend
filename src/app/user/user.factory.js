(function () {
  'use strict';
  function UserFactory($http, $q, APP_CONFIG, $rootScope) {
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
        var tmp = {};
        tmp.id = response.data.id;
        tmp.nickname = response.data.nickname;
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
        var tmp = {};
        tmp.id = response.data.id;
        tmp.nickname = response.data.nickname;
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
  UserFactory.$inject = [
    '$http',
    '$q',
    'APP_CONFIG',
    '$rootScope'
  ];
  angular.module('skeleton.user.factory.UserFactory', []).factory('UserFactory', UserFactory);
}());