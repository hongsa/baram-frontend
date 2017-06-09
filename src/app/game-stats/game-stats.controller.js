(function () {
  'use strict';
  function GameStatsController(GameStats, StatsDetail, UserInfo, jwtHelper, $rootScope, APP_CONFIG, $state, $window) {
    var vm = this;
    vm.currentPage = 1;
    vm.totalItem = 0;
    vm.paginationSize = 24;
    vm.jobFilter = 'all';
    vm.gameStatsData = [];
    vm.dataContainer = [];
    vm.searchInput = '';
    vm.searchResult = {};
    vm.searchType = 0;
    vm.onClickJobFilter = onClickJobFilter;
    vm.pageChanged = pageChanged;
    vm.onClickDetailModal = onClickDetailModal;
    vm.isJobFilterActive = isJobFilterActive;
    vm.onClickSearchGamaName = onClickSearchGamaName;

    init();
    function init() {
      var expireDate = jwtHelper.getTokenExpirationDate($rootScope.user.token).getTime();
      var now = new Date().getTime();
      if (expireDate - now <= APP_CONFIG.DAY_MS) {
        updateToken();
      } else {
        getGameStats();
      }
    }

    function updateToken() {
      UserInfo.updateToken($rootScope.user.userId).then(function (response) {
        $rootScope.isLoggedIn = true;
        $rootScope.user = JSON.parse(window.localStorage.user);
        console.log('update token success');
        if ($rootScope.user.level !== -1) {
          getGameStats();
        } else {
          $state.go('main.wait')
        }
      })
    }

    function getGameStats() {
      vm.gameStatsData.splice(0);
      vm.searchInput = '';
      vm.searchResult = {};
      vm.searchType = 0;
      GameStats.getGameStats(vm.gameStatsData, vm.jobFilter).then(function (response) {
        if (response.code === 200) {
          vm.gameStatsData.reverse();
          vm.totalItem = vm.gameStatsData.length;
          pageChanged(1)
        }
      })
    }

    function pageChanged(currentPage) {
      $window.scrollTo(0, 0);
      vm.currentPage = currentPage;
      vm.dataContainer.splice(0);
      var start = (vm.currentPage - 1) * vm.paginationSize;

      for (var i = start; i < start + vm.paginationSize; i++) {
        if (i === vm.totalItem) {
          break;
        }
        vm.dataContainer.push({
          'level': vm.gameStatsData[i].level,
          'gameName': vm.gameStatsData[i].game_name,
          'ranking': vm.gameStatsData[i].ranking,
          'job': vm.gameStatsData[i].job,
          'grade': vm.gameStatsData[i].grade,
          'weapon': vm.gameStatsData[i].weapon,
          'body': vm.gameStatsData[i].body,
          'head': vm.gameStatsData[i].head
        });
      }
    }

    function onClickDetailModal(gameName) {
      StatsDetail.open(gameName);
    }

    function onClickJobFilter(job) {
      vm.jobFilter = job;
      getGameStats();
    }

    function isJobFilterActive(jobFilter) {
      if (vm.jobFilter === jobFilter) {
        return {'color': '#fe4b60'};
      }
    }

    function onClickSearchGamaName(e) {
      if(e.which === 13 || e === 'click') {
        vm.searchResult = {};
        vm.searchType = 0;
        vm.gameStatsData.forEach(function (row, idx) {
          if (row.game_name === vm.searchInput) {
            angular.copy(row, vm.searchResult);
            vm.searchResult['paldoRanking'] = idx + 1;
            vm.searchType = 1;
            return false;
          }
          if (vm.gameStatsData.length - 1 === idx && Object.keys(vm.searchResult).length === 0) {
            vm.searchType = -1;
          }
        })
      }
    }

  }

  GameStatsController.$inject = [
    'GameStats',
    'StatsDetail',
    'UserInfo',
    'jwtHelper',
    '$rootScope',
    'APP_CONFIG',
    '$state',
    '$window'
  ];
  angular.module('baram.gameStats.controller.GameStatsController', []).controller('GameStatsController', GameStatsController);
}());