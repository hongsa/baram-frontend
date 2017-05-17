(function () {
  'use strict';
  function ToastConfig(toastrConfig) {
    angular.extend(toastrConfig, {
      autoDismiss: true,
      containerId: 'toast-container',
      extendedTimeOut: 500,
      timeOut: 1500,
      maxOpened: 0,
      newestOnTop: true,
      positionClass: 'toast-top-full-width',
      preventDuplicates: false,
      preventOpenDuplicates: false,
      target: 'body'
    });
  }

  ToastConfig.$inject = ['toastrConfig'];
  angular.module('skeleton.common.config.ToastConfig', []).config(ToastConfig);
}());