(function () {
  'use strict';
  function BoardController(Board, UserInfo, jwtHelper, $rootScope, APP_CONFIG, $state, $window) {
    var vm = this;
    vm.page = 1;
    vm.busy = false;
    vm.boardDataContainer = [];
    vm.boardFilter = 'normal';
    vm.gameName = $rootScope.user.gameName;
    vm.userLevel = $rootScope.user.level;
    vm.postData = {
      'userId': $rootScope.user.userId,
      'content': '',
      'boardType': ''
    };

    vm.getBoardList = getBoardList;
    vm.onClickPostBoard = onClickPostBoard;
    vm.onClickTextExpand = onClickTextExpand;
    vm.onClickGetReplyList = onClickGetReplyList;
    vm.onClickPostReply = onClickPostReply;
    vm.onClickBoardFilter = onClickBoardFilter;
    vm.isBoardFilterActive = isBoardFilterActive;

    init();
    function init() {
      vm.page = 1;
      var expireDate = jwtHelper.getTokenExpirationDate($rootScope.user.token).getTime();
      var now = new Date().getTime();
      if (expireDate - now <= APP_CONFIG.DAY_MS) {
        updateToken();
      } else {
        getBoardList();
      }
    }

    function updateToken() {
      UserInfo.updateToken($rootScope.user.userId).then(function (response) {
        $rootScope.isLoggedIn = true;
        $rootScope.user = JSON.parse(window.localStorage.user);
        console.log('update token success');
        if ($rootScope.user.level !== -1) {
          getBoardList();
        } else {
          $state.go('main.wait')
        }
      })
    }

    function getBoardList() {
      vm.busy = true;
      Board.getBoardList(vm.boardDataContainer, vm.page, vm.boardFilter).then(function (response) {
        vm.busy = response.last;
        vm.page +=1;
      })
    }

    function onClickPostBoard(boardType) {
      vm.postData.boardType = boardType;
      if (vm.postData.content.length < 10) {
        $window.alert('호걸이라면 10자 이상!')
      } else {
        Board.postBoard(vm.postData).then(function (response) {
          vm.postData.content = '';
          vm.postData.boardType = false;
          vm.boardDataContainer = [];
          vm.page = 1;
          getBoardList();
        })
      }
    }

    function onClickGetReplyList(item, event) {
      if (event === 'first') {
        item['replyContainer'] = [];
        item['page'] = 1;
        item['replyRequest'] = 0
      }
      Board.getReplyList(item.replyContainer, item.id, item.page).then(function (response) {
        item.page += 1;
        item['replyRequest'] += 5;
      })
    }

    function onClickPostReply(item) {
      if (item.replyData.content.length < 5) {
        $window.alert('호걸이라면 5자 이상!')
      } else {
        item['replyData']['userId'] = $rootScope.user.userId;
        Board.postReply(item.replyData, item.id).then(function (response) {
          item.replyData.content = '';
          onClickGetReplyList(item, 'first');
          item.reply_count += 1;
        })
      }
    }

    function onClickTextExpand(item) {
      item.more = false;
    }

    function onClickBoardFilter(board) {
      vm.boardFilter = board;
      vm.boardDataContainer.splice(0);
      vm.page = 1;
      getBoardList();
    }

    function isBoardFilterActive(boardFilter) {
      if (vm.boardFilter === boardFilter){
        return { 'color':'#fe4b60' };
      }
    }

  }

  BoardController.$inject = [
    'Board',
    'UserInfo',
    'jwtHelper',
    '$rootScope',
    'APP_CONFIG',
    '$state',
    '$window'
  ];
  angular.module('baram.board.controller.BoardController', []).controller('BoardController', BoardController);
}());