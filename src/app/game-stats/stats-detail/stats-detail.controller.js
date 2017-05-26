(function () {
  'use strict';

  function StatsDetailController(StatsDetailFactory, gameName, LinechartUtils, APP_CONFIG) {
    var vm = this;
    vm.gameName = gameName;
    vm.profileImage = "http://baram.nexon.com/Profile/DrawingImgbyID.aspx?loginID=" + vm.gameName + "@연";

    vm.currentPage = 1;
    vm.pageSize = 10;
    vm.totalItem = 0;
    vm.rankingStatsChartData = {
      name: '랭킹',
      data: [],
      id: 'ranking',
      color: APP_CONFIG.COLORS[10]
    };
    vm.levelStatsChartData = {
      name: '레벨',
      data: [],
      id: 'level',
      color: APP_CONFIG.COLORS[2]
    };
    vm.detailStats = {
      game_name: '',
      job: '',
      ranking: 0,
      grade: 4,
      level: 524,
      weapon: '',
      body: '',
      head: '',
      shield: '',
      right_hand: '',
      left_hand: '',
      option1: '',
      option2: '',
    };

    vm.rankingLineChartData = [
      vm.rankingStatsChartData
    ];
    vm.levelLineChartData = [
      vm.levelStatsChartData
    ];

    vm.rankingLineChartConfig = new LinechartUtils.LineChartConfig(vm.rankingLineChartData, null, true);
    vm.levelLineChartConfig = new LinechartUtils.LineChartConfig(vm.levelLineChartData, null, true);

    init();
    function init () {
      getStatsDetail()
    }
    function getStatsDetail() {
      StatsDetailFactory.getStatsDetail(vm.rankingStatsChartData.data, vm.levelStatsChartData.data, vm.detailStats, vm.gameName).then(function (response) {
        console.log(vm.detailStats)
      })

    }


  }

  StatsDetailController.$inject = [
    'StatsDetailFactory',
    'gameName',
    'LinechartUtils',
    'APP_CONFIG'
  ];

  angular.module('baram.gameStats.controller.StatsDetailController', [])
      .controller('StatsDetailController', StatsDetailController);
})();
