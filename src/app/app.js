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
    // Common
    'baram.common',
    // Home
    'baram.home',
    // Main Layout
    'baram.main',
    // Game Stats
    'baram.gameStats'
  ]);
}());