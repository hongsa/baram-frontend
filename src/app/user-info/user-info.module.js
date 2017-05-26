(function () {
  'use strict';
  angular.module('baram.userInfo', [
    // Controllers
    'baram.userInfo.controller.UserInfoController',
    // Services
    'baram.userInfo.service.UserInfo',
    // Router
    'baram.userInfo.UserInfoRouter'
  ]);
}());