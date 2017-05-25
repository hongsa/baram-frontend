(function () {
  'use strict';
  angular.module('baram.common', [
    // Configs
    'baram.common.config.MainConfig',
    'baram.common.config.HTTPInterceptorsConfig',
    'baram.common.config.ToastConfig',
    // Directives
    'baram.common.directive.headerDirective',
    // Constants
    'baram.common.constant.APP_CONFIG',
    // Interceptors
    'baram.common.interceptor.AuthInterceptor',
    // Runs
    'baram.common.run.FetchUserFromLocalStorageRun',
    'baram.common.run.RouterPermissionRun',
    // Filters
    'baram.common.filter.percentage',
    'baram.common.filter.titleCase',
    'baram.common.filter.dateString',
  ]);
}());