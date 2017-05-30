(function () {
  'use strict';
  angular.module('baram.home', [
    // Controllers
    'baram.home.controller.HomeController',
    // Services
    'baram.home.service.Home',
    // Router
    'baram.home.HomeRouter'
  ]);
}());