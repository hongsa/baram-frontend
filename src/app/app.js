(function () {
  'use strict';
  angular.module('baram', [
    'ngMessages',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'angularMoment',
    'angularSpinner',
    'toastr',
    'highcharts-ng',
    'infinite-scroll',
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
    'baram.userInfo'
  ]);
}());