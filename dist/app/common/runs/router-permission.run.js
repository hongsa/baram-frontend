(function () {
  'use strict';
  function RouterPermissionRun($rootScope, $transitions) {

    $transitions.onBefore({ to: 'home'}, function(trans) {
      if ($rootScope.isLoggedIn) {
        console.log('already logged in');
        return trans.router.stateService.target('main.gameStats');
      }
    });

    $transitions.onBefore({ to: 'main.**'}, function(trans) {
      if (!$rootScope.isLoggedIn) {
        console.log('login required');
        return trans.router.stateService.target('home');
      }
    });
  }
  RouterPermissionRun.$inject = [
    '$rootScope',
    '$transitions'
  ];
  angular.module('baram.common.run.RouterPermissionRun', []).run(RouterPermissionRun);
}());