(function () {
  'use strict';
  function Controller($rootScope, $state) {
    var vm = this;

    vm.navFilter = $state.current.name;
    vm.onClickNavigation = onClickNavigation;
    vm.isNavigationActive = isNavigationActive;

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
    '$state'
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