(function () {
  'use strict';
  function UserInfo($http, $q, $rootScope, APP_CONFIG, $state) {
    return {
      logOut: logOut,
      updateToken: updateToken,
      updateVoiceId: updateVoiceId
    };

    function logOut() {
      $rootScope.user = undefined;
      $rootScope.isLoggedIn = false;
      try {
        window.localStorage.user = undefined;
      } catch (e) {
      }
      $state.go('home')
    }

    function updateToken(userId) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'auth/' + userId,
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      }).then(function (response) {
        var tmp = {};
        tmp.userId = response.data.user_id;
        tmp.gameName = response.data.game_name;
        tmp.level = response.data.level;
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

    function updateVoiceId(putData, userId) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'users/update/' + userId,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        data: putData
      }).then(function (response) {

        deferred.resolve({
          code: response.status
        });
      }, function (err) {
        deferred.resolve({
          code: err.status
        });
      }, deferred.reject);
      return deferred.promise;

    }

  }
  UserInfo.$inject = [
    '$http',
    '$q',
    '$rootScope',
    'APP_CONFIG',
    '$state'
  ];
  angular.module('baram.userInfo.service.UserInfo', []).factory('UserInfo', UserInfo);
}());