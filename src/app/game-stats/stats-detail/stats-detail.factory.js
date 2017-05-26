(function () {
  'use strict';
  var dayInMS = 86400000;

  function StatsDetailFactory($http, $q, APP_CONFIG) {
    return {
      getStatsDetail: getStatsDetail
    };

    function getStatsDetail(rankingDataContainer, levelDataContainer, detailStats, gameName) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'game/all/' + gameName,
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
      }).then(function (response) {
        console.log(response)
        response.data.level_by_date.forEach(function (row) {
          rankingDataContainer.push([
              new Date(row.created).getTime() + (dayInMS/2),
              row.ranking
          ]);
          levelDataContainer.push([
            new Date(row.created).getTime() + (dayInMS/2),
            row.level
          ]);
        });

        angular.copy(response.data.stats, detailStats);
        deferred.resolve({
          code: response.status
        });
      }, function (err) {
        deferred.resolve({
          code: err.status
        });
      }, deferred.reject);
      return deferred.promise;

    }



  }

  StatsDetailFactory.$inject = ['$http', '$q', 'APP_CONFIG'];

  angular.module('baram.gameStats.factory.StatsDetailFactory', [])
      .factory('StatsDetailFactory', StatsDetailFactory);
})();
