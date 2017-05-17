(function () {
  'use strict';
  angular.module('skeleton.common', [
    // Configs
    'skeleton.common.config.MainConfig',
    'skeleton.common.config.HTTPInterceptorsConfig',
    'skeleton.common.config.ToastConfig',
    // Directives
    'skeleton.common.directive.headerDirective',
    // Constants
    'skeleton.common.constant.APP_CONFIG',
    // Interceptors
    'skeleton.common.interceptor.AuthInterceptor',
    // Runs
    'skeleton.common.run.FetchUserFromLocalStorageRun',
    'skeleton.common.run.RouterPermissionRun',
    // Filters
    'skeleton.common.filter.percentage',
    'skeleton.common.filter.titleCase',
    'skeleton.common.filter.dateString',
  ]);
}());