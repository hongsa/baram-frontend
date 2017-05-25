(function () {
  'use strict';
  function GameStats($http, $q, $rootScope, APP_CONFIG) {
    return {
      getGameStats: getGameStats
    };
    function getGameStats(dataContainer, jobFilter) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'game/' + jobFilter,
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      }).then(function (response) {
        console.log(response)
        response.data.forEach(function (row) {
          dataContainer.push(row)
        });

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
  GameStats.$inject = [
    '$http',
    '$q',
    '$rootScope',
    'APP_CONFIG'
  ];
  angular.module('baram.gameStats.service.GameStats', []).factory('GameStats', GameStats);
}());