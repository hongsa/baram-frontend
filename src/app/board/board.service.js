(function () {
  'use strict';
  function Board($http, $q, $rootScope, APP_CONFIG, $state) {
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
  Board.$inject = [
    '$http',
    '$q',
    '$rootScope',
    'APP_CONFIG',
    '$state'
  ];
  angular.module('baram.board.service.Board', []).factory('Board', Board);
}());