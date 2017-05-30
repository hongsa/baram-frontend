(function () {
  'use strict';
  angular.module('baram.common.constant.APP_CONFIG', []).constant('APP_CONFIG', {
    'LOCAL': 'http://localhost:8080/api/v2',
    'BACKEND_ADDRESS': 'http://localhost:5000/api/',
    'LIMIT_COUNT' : 20,
    'DAY_MS': 86400000,
    'COLORS': ['#F44336', '#2196F3', '#FFC107', '#9C27B0', '#009688', '#FF5722',
      '#00BCD4', '#CDDC39', '#673AB7', '#4CAF50', '#E91E63', '#3F51B5',
      '#FF9800', '#795548', '#8BC34A', '#000000']
  });
}());