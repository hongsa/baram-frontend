(function () {
  'use strict';
  angular.module('baram.gameStats', [
    // Controllers
    'baram.gameStats.controller.GameStatsController',
    'baram.gameStats.controller.StatsDetailController',
    // Services
    'baram.gameStats.service.GameStats',
    'baram.gameStats.service.StatsDetail',
    // Factory
    'baram.gameStats.factory.StatsDetailFactory',

    // Router
    'baram.gameStats.GameStatsRouter'
  ]);
}());