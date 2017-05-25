(function () {
  'use strict';

  function StatsDetailFactory($http, $q, APP_CONFIG) {
    return {
      getStatsDetailData: getStatsDetailData
    };

    function getStatsDetailData() {
    }



  }

  StatsDetailFactory.$inject = ['$http', '$q', 'APP_CONFIG'];

  angular.module('baram.gameStats.factory.StatsDetailFactory', [])
      .factory('StatsDetailFactory', StatsDetailFactory);
})();
