(function () {
  'use strict';
  var jobNames = {
    'all': '전체',
    'knight': '전사',
    'thief': '도적',
    'archer': '궁사',
    'god': '천인',
    'magician': '주술사',
    'black-magician': '마도사',
    'priest': '도사'
  };
  function jobFilter() {
    return function (input) {
      return jobNames[input];
    };
  }
  angular.module('baram.common.filter.jobFilter', []).filter('jobFilter', jobFilter);
}());