(function () {
  'use strict';
  function GameStatsController(GameStats, StatsDetail) {
    var vm = this;
    vm.currentPage = 1;
    vm.totalItem = 0;
    vm.paginationSize = 24;
    vm.jobFilter = 'all';
    vm.gameStatsData = [];
    vm.dataContainer = [];

    vm.onClickJobFilter = onClickJobFilter;
    vm.pageChanged = pageChanged;
    vm.onClickDetailModal = onClickDetailModal;
    vm.isJobFilterActive = isJobFilterActive;

    init();
    function init() {
      getGameStats();
    }

    function getGameStats() {
      vm.gameStatsData.splice(0);
      GameStats.getGameStats(vm.gameStatsData, vm.jobFilter).then(function (response) {
        if (response.code === 200) {
          vm.gameStatsData.reverse();
          vm.totalItem = vm.gameStatsData.length;
          pageChanged(1)
        }
      })
    }

    function pageChanged(currentPage) {
      vm.currentPage = currentPage;
      vm.dataContainer.splice(0);
      var start = (vm.currentPage - 1) * vm.paginationSize;

      for (var i = start; i < start + vm.paginationSize; i++) {
        if(i === vm.totalItem) {
          break;
        }
        vm.dataContainer.push({
            'level' : vm.gameStatsData[i].level,
            'gameName' : vm.gameStatsData[i].game_name,
            'ranking' : vm.gameStatsData[i].ranking,
            'job' : vm.gameStatsData[i].job,
            'grade' : vm.gameStatsData[i].grade,
            'weapon' : vm.gameStatsData[i].weapon,
            'body' : vm.gameStatsData[i].body,
            'head' : vm.gameStatsData[i].head
      });
      }
    }

    function onClickDetailModal (gameName) {
      StatsDetail.open(gameName);
    }

    function onClickJobFilter(job) {
      vm.jobFilter = job;
      getGameStats();
    }

    function isJobFilterActive(jobFilter) {
      if (vm.jobFilter === jobFilter){
        return { 'color':'#fe4b60' };
      }
    }

  }

  GameStatsController.$inject = [
    'GameStats',
    'StatsDetail'
  ];
  angular.module('baram.gameStats.controller.GameStatsController', []).controller('GameStatsController', GameStatsController);
}());