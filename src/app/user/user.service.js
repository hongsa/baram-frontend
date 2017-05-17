(function () {
  'use strict';
  function User($mdDialog) {
    this.logInModal = function () {
      return $mdDialog.show({
        clickOutsideToClose: true,
        templateUrl: 'app/user/login.html',
        controller: 'UserController',
        controllerAs: 'vm'
      });
    };
  }
  User.$inject = ['$mdDialog'];
  angular.module('skeleton.user.service.User', []).service('User', User);
}());