(function () {
  'use strict';
  function BoardController(Board) {
    var vm = this;
  }
  BoardController.$inject = [
    'Board'
  ];
  angular.module('baram.board.controller.BoardController', []).controller('BoardController', BoardController);
}());