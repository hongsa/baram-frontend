(function () {
  'use strict';
  function Controller($rootScope) {
    var vm = this;

  }

  Controller.$inject = [
    '$rootScope'
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