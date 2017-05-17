(function () {
  'use strict';
  function UserController(UserFactory, $mdDialog, $rootScope, toastr) {
    var vm = this;
    vm.cancel = cancel;
    vm.signUpData = {
      login_id: '',
      password: '',
      nickname: ''
    };
    vm.logInData = {
      login_id: '',
      password: ''
    };
    vm.errorText1 = '';
    vm.errorText2 = '';
    vm.logIn = logIn;
    vm.signUp = signUp;
    function logIn(disable) {
      if (disable === false) {
        UserFactory.logIn(vm.logInData).then(function (response) {
          if (response.code === 200) {
            $rootScope.isLoggedIn = true;
            $rootScope.user = JSON.parse(window.localStorage.user);
            toastr.success('로그인 완료');
            $rootScope.$broadcast('login', 'success');
            cancel();
          } else {
            vm.errorText1 = response.msg;
          }
        });
      }
    }
    function signUp(disable) {
      if (disable === false) {
        UserFactory.signUp(vm.signUpData).then(function (response) {
          if (response.code === 201) {
            $rootScope.isLoggedIn = true;
            $rootScope.user = JSON.parse(window.localStorage.user);
            $rootScope.$broadcast('signup', 'success');
          } else {
            vm.errorText2 = response.msg;
          }
        });
      }
    }
    function cancel() {
      $mdDialog.cancel();
    }
  }
  UserController.$inject = [
    'UserFactory',
    '$mdDialog',
    '$rootScope',
    'toastr'
  ];
  angular.module('skeleton.user.controller.UserController', []).controller('UserController', UserController);
}());