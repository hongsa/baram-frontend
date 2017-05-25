(function () {
  'use strict';
  function MainConfig($urlRouterProvider) {
    $urlRouterProvider.otherwise('/index');
  }
  MainConfig.$inject = ['$urlRouterProvider'];
  angular.module('baram.common.config.MainConfig', []).config(MainConfig);
}());