(function () {
  'use strict';
  function UserInfo($http, $q, $rootScope, APP_CONFIG, $state) {
    return {
      logOut: logOut
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