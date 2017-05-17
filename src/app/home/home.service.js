(function () {
  'use strict';
  function Home($http, $q, $rootScope, APP_CONFIG) {
    return {
      getData: getData,
    };
    function getData() {
    }
  }
  Home.$inject = [
    '$http',
    '$q',
    '$rootScope',
    'APP_CONFIG'
  ];
  angular.module('skeleton.home.service.Home', []).factory('Home', Home);
}());