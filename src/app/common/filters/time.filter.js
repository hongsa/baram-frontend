(function () {
  'use strict';
  var timeNames = {
    'minutes ago': '분',
    'hours ago': '시간',
    'days ago': '일',
    'a few seconds ago': '몇초',
    'a minute ago': '1분',
    'an hour ago': '1시간',
    'a day ago': '1일'

  };
  function timeDiffFilter() {
    return function (input) {
      for (var obj in timeNames) {
        if (input === obj) {
          return timeNames[obj] + ' 전';
        } else if (input.includes(obj)) {
          return input.replace(' ', '').replace(obj, timeNames[obj]) + ' 전'
        }

      }
    };
  }
  angular.module('baram.common.filter.timeDiffFilter', []).filter('timeDiffFilter', timeDiffFilter);
}());