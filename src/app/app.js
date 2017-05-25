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
    // Common
    'baram.common',
    // Home
    'baram.home'
  ]);
}());