(function () {
  'use strict';
  function MainConfig($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  }
  MainConfig.$inject = ['$urlRouterProvider'];
  angular.module('skeleton.common.config.MainConfig', []).config(MainConfig);
}());