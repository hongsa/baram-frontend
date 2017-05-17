(function () {
  'use strict';
  function HomeRouter($stateProvider) {
    $stateProvider.state('home', {
      templateUrl: 'app/home/home.html',
      url: '/',
      controller: 'HomeController',
      controllerAs: 'vm'
    });
  }
  HomeRouter.$inject = ['$stateProvider'];
  angular.module('skeleton.home.HomeRouter', []).config(HomeRouter);
}());