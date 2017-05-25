(function () {
  'use strict';
  angular.module('baram.common.constant.APP_CONFIG', []).constant('APP_CONFIG', {
    'LOCAL': 'http://localhost:8080/api/v2',
    'BACKEND_ADDRESS': 'http://localhost:5000/api/',
    'LIMIT_COUNT' : 20
  });
}());