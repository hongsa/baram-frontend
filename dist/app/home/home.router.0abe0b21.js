(function () {
  'use strict';
  function HomeRouter($stateProvider) {
    $stateProvider.state('home', {
      templateUrl: 'app/home/home.html',
      url: '/',
      controller: 'HomeController',
      controllerAs: 'vm',
      authenticate: true
    });
  }
  HomeRouter.$inject = ['$stateProvider'];
  angular.module('baram.home.HomeRouter', []).config(HomeRouter);
}());