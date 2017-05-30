(function () {
  'use strict';
  function FetchUserFromLocalStorageRun($rootScope) {
    moment.locale('en');
    try {
      $rootScope.user = JSON.parse(window.localStorage.user);
      if ($rootScope.user) {
        $rootScope.isLoggedIn = true;
      } else {
      }
    } catch (e) {
    }
  }
  FetchUserFromLocalStorageRun.$inject = [
    '$rootScope'
  ];
  angular.module('baram.common.run.FetchUserFromLocalStorageRun', []).run(FetchUserFromLocalStorageRun);
}());