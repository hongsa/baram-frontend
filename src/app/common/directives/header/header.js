(function () {
  'use strict';
  function Controller($rootScope, User, UserFactory, $scope, toastr, $filter) {
    var vm = this;
    vm.user = {
      isLoggedIn: false,
      nickname: ''
    };
    vm.ddSelectOptions = [
      {
        text: '',
        value: 0
      },
      {
        text: '팬 등록',
        value: 2
      },
      {
        text: '로그아웃',
        value: 1
      }
    ];
    vm.ddSelectSelected = { text: '' };
    vm.userModal = userModal;
    vm.modalEvent = modalEvent;
    init();
    $scope.$on('login', function (event, arg) {
      init('login');
    });
    $scope.$on('signOut', function (event, arg) {
      toastr.success('로그아웃 완료!');
      init('signOut');
    });
    $scope.$on('signup', function (event, arg) {
      init('signUp');
    });

    function init(type) {
      logInCheck(type);
    }
    function logInCheck(type) {
      if ($rootScope.isLoggedIn === true) {
        vm.user.isLoggedIn = true;
        vm.user.nickname = $rootScope.user.nickname;
        vm.ddSelectOptions[0].text = vm.user.nickname;
        vm.ddSelectSelected.text = vm.user.nickname;
      } else {
        vm.user.isLoggedIn = false;
      }
    }
    function modalEvent(selected) {
      if (selected.value === 1) {
        UserFactory.signOut();
      }
    }
    function userModal() {
      User.logInModal();
    }
  }
  Controller.$inject = [
    '$rootScope',
    'User',
    'UserFactory',
    '$scope',
    'toastr',
    '$filter'
  ];
  function headerDirective() {
    return {
      templateUrl: 'app/common/directives/header/header.html',
      restrict: 'E',
      replace: true,
      controller: Controller,
      controllerAs: 'vm'
    };
  }
  angular.module('skeleton.common.directive.headerDirective', []).directive('header', headerDirective);
}());