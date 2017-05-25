(function () {
  'use strict';

  function StatsDetailController(StatsDetail, gameName) {
    var vm = this;
    vm.gameName = gameName;
    console.log(vm.gameName)

    vm.currentPage = 1;
    vm.pageSize = 10;
    vm.totalItem = 0;


  }

  StatsDetailController.$inject = [
    'StatsDetail',
    'gameName'
  ];

  angular.module('baram.gameStats.controller.StatsDetailController', [])
      .controller('StatsDetailController', StatsDetailController);
})();
