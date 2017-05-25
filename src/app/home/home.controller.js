(function () {
  'use strict';
  function HomeController(Home) {
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
    vm.errorText1 = '';
    vm.errorText2 = '';

    vm.showFormType = showFormType;
    vm.onClickLogin = onClickLogin;
    vm.onClickSignUp  = onClickSignUp;

    function showFormType (type) {
      vm.formType = type;
    }
    
    function onClickLogin () {
      Home.logIn(vm.logInData).then(function (response) {
        if (response.code === 200) {
          $rootScope.isLoggedIn = true;
          $rootScope.user = JSON.parse(window.localStorage.user);
          toastr.success('로그인 완료');
        } else {
          vm.errorText1 = response.msg;
        }
      })
      
    }

    function onClickSignUp () {
      console.log(vm.signUpData);
      Home.signUp(vm.signUpData).then(function (response) {
        if (response.code === 201) {
          $rootScope.isLoggedIn = true;
          $rootScope.user = JSON.parse(window.localStorage.user);
          toastr.success('가입 완료');
        } else {
          vm.errorText2 = response.msg;
        }
      })
    }

  }
  HomeController.$inject = [
    'Home'
  ];
  angular.module('baram.home.controller.HomeController', []).controller('HomeController', HomeController);
}());