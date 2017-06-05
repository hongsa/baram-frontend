(function () {
  'use strict';
  angular.module('baram.admin', [
    // Controllers
    'baram.admin.controller.AdminController',
    // Services
    'baram.admin.service.Admin',
    // Router
    'baram.admin.AdminRouter'
  ]);
}());