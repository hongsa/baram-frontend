(function () {
  'use strict';
  function HomeController(Home, $rootScope, $state) {
    var vm = this;
    vm.formType = 'logIn';
    vm.logInData = {
      'loginId': '',
      'password': ''
    };
    vm.signUpData = {
      'logInId': '',
      'password': '',
      'gameName': '',
      'name': '',
      'age': '',
      'phone': '',
      'sex': '',
      'army': ''
    };
    vm.nexonData = {
      baramId: '',
      baramPassword: ''
    }
    vm.errorText1 = '';
    vm.errorText2 = '';

    vm.showFormType = showFormType;
    vm.onClickLogin = onClickLogin;
    vm.onClickSignUp  = onClickSignUp;
    vm.onClickVerifyBaram = onClickVerifyBaram;

    function showFormType (type) {
      vm.formType = type;
    }
    
    function onClickLogin (valid) {
      if (valid) {
        Home.logIn(vm.logInData).then(function (response) {
          if (response.code === 200) {
            $rootScope.isLoggedIn = true;
            $rootScope.user = JSON.parse(window.localStorage.user);
            if ($rootScope.user.level === -1) {
              $state.go('main.wait');
            } else {
              $state.go('main.board');
            }
          } else {
            vm.errorText1 = response.msg;
          }
        })
      }

    }

    function onClickSignUp (valid) {
      if (valid) {
        Home.signUp(vm.signUpData).then(function (response) {
          if (response.code === 201) {
            $rootScope.isLoggedIn = true;
            $rootScope.user = JSON.parse(window.localStorage.user);
            if ($rootScope.user.level === -1) {
              $state.go('main.wait');
            } else {
              $state.go('main.board');
            }
          } else {
            vm.errorText2 = response.msg;
          }
        })
      }
    }

    function onClickVerifyBaram() {
      Home.verifyBaram(vm.nexonData).then(function (response) {

      })

    }

  }
  HomeController.$inject = [
    'Home',
    '$rootScope',
    '$state'
  ];
  angular.module('baram.home.controller.HomeController', []).controller('HomeController', HomeController);
}());