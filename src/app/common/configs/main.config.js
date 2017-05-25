(function () {
  'use strict';
  function MainConfig($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  }
  MainConfig.$inject = ['$urlRouterProvider'];
  angular.module('baram.common.config.MainConfig', []).config(MainConfig);
}());