(function () {
  'use strict';
  function BoardController(Board, $rootScope) {
    var vm = this;
    vm.page = 1;
    vm.busy = false;
    vm.gameName = $rootScope.user.gameName;
    vm.normalDataContainer = [];
    vm.noticeDataContainer = [];
    vm.userLevel = $rootScope.user.level;
    vm.postData = {
      'userId': $rootScope.user.userId,
      'content': '',
      'level': false
    };

    vm.getBoardList = getBoardList;
    vm.onClickPostBoard = onClickPostBoard;
    vm.onClickTextExpand = onClickTextExpand;
    vm.onClickGetReplyList = onClickGetReplyList;
    vm.onClickPostReply = onClickPostReply;

    init();
    function init() {
      vm.page = 1;
      getBoardList();
    }

    function getBoardList() {
      vm.busy = true;
      Board.getBoardList(vm.noticeDataContainer, vm.normalDataContainer, vm.page).then(function (response) {
        vm.busy = false;
        vm.page +=1;
        console.log(vm.page);
      })
    }

    function onClickPostBoard() {
      Board.postBoard(vm.postData).then(function (response) {
        vm.postData.content = '';
        vm.normalDataContainer = [];
        vm.noticeDataContainer = [];
        vm.page = 1;
        getBoardList();
      })
    }

    function onClickGetReplyList(item, type) {
      if (type === 'first') {
        item['replyContainer'] = [];
        item['page'] = 1;
        item['replyRequest'] = 0
      }
      Board.getReplyList(item.replyContainer, item.id, item.page).then(function (response) {
        item.page += 1;
        item['replyRequest'] += 5;
        console.log(item)
      })
    }

    function onClickPostReply(item) {
      item['replyData']['userId'] = $rootScope.user.userId;
      Board.postReply(item.replyData, item.id).then(function (response) {
        item.replyData.content = '';
        // item.replyContainer.push({
        //   'content': item.replyData.content,
        //   'gameName': $rootScope.user.gameName,
        //   'created': new Date()
        // })
        onClickGetReplyList(item, 'first');
      })
    }

    function onClickTextExpand(item) {
      item.more = false;
    }

  }

  BoardController.$inject = [
    'Board',
    '$rootScope'
  ];
  angular.module('baram.board.controller.BoardController', []).controller('BoardController', BoardController);
}());