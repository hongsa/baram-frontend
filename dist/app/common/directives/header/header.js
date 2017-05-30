(function () {
  'use strict';
  function Controller($rootScope, $state, $window, $scope) {
    var vm = this;

    vm.navFilter = $state.current.name;
    vm.onClickNavigation = onClickNavigation;
    vm.isNavigationActive = isNavigationActive;
    vm.naviType = '';

    init();
    function init() {
      if ($window.innerWidth >= 1000) {
        vm.naviType = 'web';
      } else {
        vm.naviType = 'mobile';
      }
    }

    angular.element($window).on('resize', function () {
      if ($window.innerWidth >= 1000) {
          vm.naviType = 'web';
        $scope.$digest()
      } else {
        vm.naviType = 'mobile';
        $scope.$digest()
      }

    });

    if ($rootScope.user) {
      vm.gameName = $rootScope.user.gameName;
    }

    function onClickNavigation(navFilter) {
      vm.navFilter = navFilter;
    }

    function isNavigationActive(navFilter) {
      if (vm.navFilter === navFilter) {
        return { 'color':'#fe4b60' };
      }
    }
  }

  Controller.$inject = [
    '$rootScope',
    '$state',
    '$window',
    '$scope'
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
  angular.module('baram.common.directive.headerDirective', []).directive('header', headerDirective);
}());