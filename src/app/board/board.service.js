(function () {
  'use strict';
  function Board($http, $q, $rootScope, APP_CONFIG, $state, $filter) {
    return {
      getBoardList: getBoardList,
      postBoard: postBoard,
      getReplyList: getReplyList,
      postReply: postReply
    };

    function getBoardList(boardDataContainer, page, boardFilter) {
      var deferred = $q.defer();
      var last = false;
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'boards/' + boardFilter + '/' + page,
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      }).then(function (response) {
        if (response.data.board.length === 0) {
          last = true;
        }
        response.data.board.forEach(function (row) {
          row['replyData'] = {
            'content': ''
          };
          var timeDiff = moment(row.created, "YYYY.MM.DD.HH.mm").fromNow();
          row['timeDiff'] = $filter('timeDiffFilter')(timeDiff);
          boardDataContainer.push(row)
        });

        deferred.resolve({
          code: response.status,
          last: last
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
        url: APP_CONFIG.BACKEND_ADDRESS + 'replies/' + boardId + '/' + page,
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      }).then(function (response) {
        console.log(response)
        response.data.reply.forEach(function (row) {
          var timeDiff = moment(row.created, "YYYY.MM.DD.HH.mm").fromNow();
          row['timeDiff'] = $filter('timeDiffFilter')(timeDiff);
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
        url: APP_CONFIG.BACKEND_ADDRESS + 'replies/' + boardId,
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
    '$state',
    '$filter'
  ];
  angular.module('baram.board.service.Board', []).factory('Board', Board);
}());