(function () {
  'use strict';
  function HomeRouter($stateProvider) {
    $stateProvider.state('home', {
      templateUrl: 'app/home/home.html',
      url: '/index',
      controller: 'HomeController',
      controllerAs: 'vm'
    });
  }
  HomeRouter.$inject = ['$stateProvider'];
  angular.module('baram.home.HomeRouter', []).config(HomeRouter);
}());