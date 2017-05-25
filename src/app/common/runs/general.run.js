(function () {
  'use strict';
  function FetchUserFromLocalStorageRun($rootScope, $http, APP_CONFIG) {
    try {
      $rootScope.user = JSON.parse(window.localStorage.user);
      if ($rootScope.user) {
        $rootScope.isLoggedIn = true;
      }
    } catch (e) {
    }
  }
  FetchUserFromLocalStorageRun.$inject = [
    '$rootScope',
    '$http',
    'APP_CONFIG'
  ];
  angular.module('baram.common.run.FetchUserFromLocalStorageRun', []).run(FetchUserFromLocalStorageRun);
}());