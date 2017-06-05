(function () {
  'use strict';
  angular.module('baram', [
    'ngMessages',
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'angular-loading-bar',
    'angularMoment',
    'angularSpinner',
    'toastr',
    'highcharts-ng',
    'infinite-scroll',
    'angular-jwt',
    // Common
    'baram.common',
    // Home
    'baram.home',
    // Main Layout
    'baram.main',
    // Game Stats
    'baram.gameStats',
    // Board
    'baram.board',
    // Contact
    'baram.contact',
    // User Info
    'baram.userInfo',
    // Wait
    'baram.wait',
    // Admin
    'baram.admin'
  ]);
}());