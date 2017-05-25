(function () {
  'use strict';
  function RouterPermissionRun($rootScope, $state, $location) {
    console.log($rootScope)
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      console.log('permission')
      if( toState.authenticate && !$rootScope.isLoggedIn) {
        $state.transitionTo('home');
        event.preventDefault();
      }
    });
  }
  RouterPermissionRun.$inject = [
    '$rootScope',
    '$state',
    '$location'
  ];
  angular.module('baram.common.run.RouterPermissionRun', []).run(RouterPermissionRun);
}());