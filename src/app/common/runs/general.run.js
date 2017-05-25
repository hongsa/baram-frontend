(function () {
  'use strict';
  function FetchUserFromLocalStorageRun($rootScope, $location) {
    try {
      $rootScope.user = JSON.parse(window.localStorage.user);
      if ($rootScope.user) {
        $rootScope.isLoggedIn = true;
        console.log('main')
        $location.path("/main/game-stats");
      } else {
        console.log('login')
        $location.path("/index");
      }
    } catch (e) {
    }
  }
  FetchUserFromLocalStorageRun.$inject = [
    '$rootScope',
    '$location'
  ];
  angular.module('baram.common.run.FetchUserFromLocalStorageRun', []).run(FetchUserFromLocalStorageRun);
}());