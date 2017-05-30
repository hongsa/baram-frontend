(function () {
  'use strict';
  function WaitRouter($stateProvider) {
    $stateProvider.state('main.wait', {
      templateUrl: 'app/wait/wait.html',
      url: '/wait',
      controller: 'WaitController',
      controllerAs: 'vm'
    });
  }
  WaitRouter.$inject = ['$stateProvider'];
  angular.module('baram.wait.WaitRouter', []).config(WaitRouter);
}());