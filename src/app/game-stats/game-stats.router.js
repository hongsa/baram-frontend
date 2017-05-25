(function () {
  'use strict';
  function GameStatsRouter($stateProvider) {
    $stateProvider.state('main.gameStats', {
      templateUrl: 'app/game-stats/game-stats.html',
      url: '/game-stats',
      controller: 'GameStatsController',
      controllerAs: 'vm'
    });
  }
  GameStatsRouter.$inject = ['$stateProvider'];
  angular.module('baram.gameStats.GameStatsRouter', []).config(GameStatsRouter);
}());