(function () {
  'use strict';
  function WaitController(UserInfo, $rootScope, $state) {
    var vm = this;

    vm.onClickLogOut = onClickLogOut;

    init();
    function init () {
      if ($rootScope.user) {
        vm.gameName = $rootScope.user.gameName;
        updateToken();
      }
    }

    function onClickLogOut() {
      UserInfo.logOut();
    }

    function updateToken() {
      UserInfo.updateToken($rootScope.user.userId).then(function (response) {
        $rootScope.isLoggedIn = true;
        $rootScope.user = JSON.parse(window.localStorage.user);
        console.log('update token success');
        if ($rootScope.user.level !== -1) {
          $state.go('main.gameStats')
        }
      })
    }

  }
  WaitController.$inject = [
    'UserInfo',
    '$rootScope',
    '$state'
  ];
  angular.module('baram.wait.controller.WaitController', []).controller('WaitController', WaitController);
}());