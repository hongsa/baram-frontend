(function () {
  'use strict';
  angular.module('skeleton', [
    'ngMessages',
    'ui.router',
    'angular-loading-bar',
    'ngAnimate',
    'ngMaterial',
    'angularMoment',
    'angularSpinner',
    'toastr',
    // Common
    'skeleton.common',
    // Home
    'skeleton.home',
    // Login & Sign up
    'skeleton.user',
  ]);
}());