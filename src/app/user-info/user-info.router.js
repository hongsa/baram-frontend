(function () {
  'use strict';
  function UserInfoRouter($stateProvider) {
    $stateProvider.state('main.userInfo', {
      templateUrl: 'app/user-info/user-info.html',
      url: '/user-info',
      controller: 'UserInfoController',
      controllerAs: 'vm',
      authenticate: true
    });
  }
  UserInfoRouter.$inject = ['$stateProvider'];
  angular.module('baram.userInfo.UserInfoRouter', []).config(UserInfoRouter);
}());