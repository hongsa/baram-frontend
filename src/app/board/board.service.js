(function () {
  'use strict';
  function Board($http, $q, $rootScope, APP_CONFIG, $state) {
    return {
      getBoardList: getBoardList,
      postBoard: postBoard,
      getReplyList: getReplyList,
      postReply: postReply
    };

    function getBoardList(noticeDataContainer, normalDataContainer, page) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'boards?page=' + page,
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      }).then(function (response) {
        response.data.notice.forEach(function (row) {
          row['replyData'] = {
            'content': ''
          };
          noticeDataContainer.push(row)
        });

        response.data.normal.forEach(function (row) {
          row['replyData'] = {
            'content': ''
          };
          normalDataContainer.push(row)
        });

        deferred.resolve({
          code: response.status
        });
      }, function (err) {
        deferred.resolve({
          code: err.status
        });
      }, deferred.reject);
      return deferred.promise;
    }

    function postBoard(postData) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'boards',
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        data: postData
      }).then(function (response) {

        deferred.resolve({
          code: response.status
        });
      }, function (err) {
        deferred.resolve({
          code: err.status
        });
      }, deferred.reject);
      return deferred.promise;
    }

    function getReplyList(dataContainer, boardId, page) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'boards/' + boardId + '?page=' + page,
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      }).then(function (response) {
        console.log(response)
        response.data.reply.forEach(function (row) {
          dataContainer.push(row)
        });

        deferred.resolve({
          code: response.status
        });
      }, function (err) {
        deferred.resolve({
          code: err.status
        });
      }, deferred.reject);
      return deferred.promise;
    }

    function postReply(replyData, boardId) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'boards/' + boardId,
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        data: replyData
      }).then(function (response) {

        deferred.resolve({
          code: response.status
        });
      }, function (err) {
        deferred.resolve({
          code: err.status
        });
      }, deferred.reject);
      return deferred.promise;
    }

  }
  Board.$inject = [
    '$http',
    '$q',
    '$rootScope',
    'APP_CONFIG',
    '$state'
  ];
  angular.module('baram.board.service.Board', []).factory('Board', Board);
}());