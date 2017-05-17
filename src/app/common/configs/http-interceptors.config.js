(function () {
  'use strict';
  function HTTPInterceptorsConfig($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }
  HTTPInterceptorsConfig.$inject = ['$httpProvider'];
  angular.module('skeleton.common.config.HTTPInterceptorsConfig', []).config(HTTPInterceptorsConfig);
}());