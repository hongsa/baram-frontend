(function () {
  'use strict';
  function BoardRouter($stateProvider) {
    $stateProvider.state('main.board', {
      templateUrl: 'app/board/board.html',
      url: '/board',
      controller: 'BoardController',
      controllerAs: 'vm',
      authenticate: true
    });
  }
  BoardRouter.$inject = ['$stateProvider'];
  angular.module('baram.board.BoardRouter', []).config(BoardRouter);
}());