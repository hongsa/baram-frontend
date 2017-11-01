(function () {
  'use strict';
  var timeNames = {
    'minutes ago': '분',
    'hours ago': '시간',
    'days ago': '일',
    'weeks ago' : '주',
    'months ago' : '달',
    'years ago' : '년',
    'a few seconds ago': '몇초',
    'a minute ago': '1분',
    'an hour ago': '1시간',
    'a day ago': '1일',
    'a week ago' : '1주',
    'a month ago' : '1달',
    'a year ago' : '1년'

  };
  function timeDiffFilter() {
    return function (input) {
      for (var obj in timeNames) {
        if (input === obj) {
          return timeNames[obj] + ' 전';
        } else if (input.indexOf(obj) !== -1) {
          return input.replace(' ', '').replace(obj, timeNames[obj]) + ' 전'
        }

      }
    };
  }
  angular.module('baram.common.filter.timeDiffFilter', []).filter('timeDiffFilter', timeDiffFilter);
}());