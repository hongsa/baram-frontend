(function () {
  'use strict';
  angular.module('skeleton.user', [
    // Controllers
    'skeleton.user.controller.UserController',
    // Services
    'skeleton.user.service.User',
    //factory
    'skeleton.user.factory.UserFactory'
  ]);
}());