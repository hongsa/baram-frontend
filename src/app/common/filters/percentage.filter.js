(function () {
  'use strict';
  function percentageFilter($filter) {
    return function (input, decimals) {
      return $filter('number')(input * 100, decimals) + '%';
    };
  }
  angular.module('baram.common.filter.percentage', []).filter('percentage', percentageFilter);
}());