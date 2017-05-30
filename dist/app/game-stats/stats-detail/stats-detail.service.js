(function () {
  'use strict';

  function StatsDetail($uibModal) {
    this.open = function (gameName) {
      return $uibModal.open({
        templateUrl: 'app/game-stats/stats-detail/stats-detail.html',
        controller: 'StatsDetailController',
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          gameName: function () {
            return gameName;
          }
        }
      });
    };
  }

  StatsDetail.$inject = ['$uibModal'];

  angular.module('baram.gameStats.service.StatsDetail', [])
      .service('StatsDetail', StatsDetail);
})();
