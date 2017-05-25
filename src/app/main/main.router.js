(function () {
  'use strict';
  function MainRouter($stateProvider) {
    $stateProvider.state('main', {
      templateUrl: 'app/main/main.html',
      url: '/main'
    });
  }
  MainRouter.$inject = ['$stateProvider'];
  angular.module('baram.main.MainRouter', []).config(MainRouter);
}());