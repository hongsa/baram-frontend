(function () {
  'use strict';
  function UserInfoController(UserInfo, StatsDetailFactory, $rootScope, APP_CONFIG, LinechartUtils, $window) {
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
    vm.userInfo = {
      voiceId: ''
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
      option2: ''
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
    vm.onClickProfileUpdate = onClickProfileUpdate;

    init();
    function init () {
      if ($rootScope.user) {
        vm.gameName = $rootScope.user.gameName;
        vm.userId = $rootScope.user.userId;
        vm.profileImage = "http://baram.nexon.com/Profile/DrawingImgbyID.aspx?loginID=" + vm.gameName + "@연";
      }
      getStatsDetail()
    }
    function getStatsDetail() {
      StatsDetailFactory.getStatsDetail(vm.rankingStatsChartData.data, vm.levelStatsChartData.data, vm.detailStats, vm.userInfo, vm.gameName).then(function (response) {
      })
    }

    function onClickLogOut() {
      UserInfo.logOut();
    }

    function onClickProfileUpdate() {
      UserInfo.updateVoiceId(vm.userInfo, vm.userId).then(function (response) {
        if(response.code === 200) {
          $window.alert('변경되었습니다.');
        }
      })
    }
  }
  UserInfoController.$inject = [
    'UserInfo',
    'StatsDetailFactory',
    '$rootScope',
    'APP_CONFIG',
    'LinechartUtils',
    '$window'
  ];
  angular.module('baram.userInfo.controller.UserInfoController', []).controller('UserInfoController', UserInfoController);
}());