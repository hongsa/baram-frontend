(function () {
  'use strict';
  function MainConfig($urlRouterProvider, $qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $urlRouterProvider.otherwise('/');
  }
  MainConfig.$inject = ['$urlRouterProvider', '$qProvider'];
  angular.module('baram.common.config.MainConfig', []).config(MainConfig);
}());