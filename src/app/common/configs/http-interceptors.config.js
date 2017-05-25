(function () {
  'use strict';
  function HTTPInterceptorsConfig($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }
  HTTPInterceptorsConfig.$inject = ['$httpProvider'];
  angular.module('baram.common.config.HTTPInterceptorsConfig', []).config(HTTPInterceptorsConfig);
}());