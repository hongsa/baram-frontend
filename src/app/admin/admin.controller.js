(function () {
  'use strict';
  function AdminController(Admin, $rootScope, $state) {
    var vm = this;
    vm.dataContainer = [];
    vm.putData = {
      'level': 0
    };
    vm.level = -1;
    vm.onClickPutUserLevel = onClickPutUserLevel;
    vm.onClickLevelFilter = onClickLevelFilter;


    init();

    function init() {
      if ($rootScope.user.level !== 1) {
        $state.go('main.board')
      }

      getWaitList();
    }


    function getWaitList() {
      vm.dataContainer.splice(0);
      Admin.getWaitList(vm.dataContainer, vm.level).then(function (response) {
        console.log(vm.dataContainer)
      })
    }

    function onClickPutUserLevel(user) {
      Admin.putUserLevel(vm.putData, user.id).then(function (response) {
        user.level = 0;
      })
    }

    function onClickLevelFilter (level) {
      vm.level = level;
      getWaitList();
    }


  }

  AdminController.$inject = [
    'Admin',
    '$rootScope',
    '$state'
  ];
  angular.module('baram.admin.controller.AdminController', []).controller('AdminController', AdminController);
}());