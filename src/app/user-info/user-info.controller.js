(function () {
  'use strict';
  function UserInfoController(UserInfo, StatsDetailFactory, $rootScope, APP_CONFIG, LinechartUtils) {
    var vm = this;
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

    vm.onClickLogOut = onClickLogOut;

    init();
    function init () {
      if ($rootScope.user) {
        vm.gameName = $rootScope.user.gameName;
        vm.profileImage = "http://baram.nexon.com/Profile/DrawingImgbyID.aspx?loginID=" + vm.gameName + "@연";
      }
      getStatsDetail()
    }
    function getStatsDetail() {
      StatsDetailFactory.getStatsDetail(vm.rankingStatsChartData.data, vm.levelStatsChartData.data, vm.detailStats, vm.gameName).then(function (response) {
      })
    }

    function onClickLogOut() {
      UserInfo.logOut();
    }
  }
  UserInfoController.$inject = [
    'UserInfo',
    'StatsDetailFactory',
    '$rootScope',
    'APP_CONFIG',
    'LinechartUtils'
  ];
  angular.module('baram.userInfo.controller.UserInfoController', []).controller('UserInfoController', UserInfoController);
}());