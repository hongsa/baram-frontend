(function () {
  'use strict';
  function MainConfig($urlRouterProvider, $qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $urlRouterProvider.otherwise('/index');
  }
  MainConfig.$inject = ['$urlRouterProvider', '$qProvider'];
  angular.module('baram.common.config.MainConfig', []).config(MainConfig);
}());