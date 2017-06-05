(function () {
  'use strict';
  function AdminRouter($stateProvider) {
    $stateProvider.state('main.admin', {
      templateUrl: 'app/admin/admin.html',
      url: '/admin',
      controller: 'AdminController',
      controllerAs: 'vm',
      authenticate: true
    });
  }
  AdminRouter.$inject = ['$stateProvider'];
  angular.module('baram.admin.AdminRouter', []).config(AdminRouter);
}());