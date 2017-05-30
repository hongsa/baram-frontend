(function () {
  'use strict';
  angular.module('baram.board', [
    // Controllers
    'baram.board.controller.BoardController',
    // Services
    'baram.board.service.Board',
    // Router
    'baram.board.BoardRouter'
  ]);
}());