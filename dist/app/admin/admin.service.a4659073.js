(function () {
  'use strict';
  function Admin($http, $q, $rootScope, APP_CONFIG, $state) {
    return {
      getWaitList: getWaitList,
      putUserLevel: putUserLevel
    };

    function getWaitList(dataContainer, level) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'admin/users?level=' + level,
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
      }).then(function (response) {
        response.data.wait_user_list.forEach(function (row) {
          dataContainer.push(row)
        });

        deferred.resolve({
          code: response.status,
        });
      }, function (err) {
        deferred.resolve({
          code: err.status,
        });
      }, deferred.reject);
      return deferred.promise;
    }

    function putUserLevel(putData, userId) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'admin/users/' + userId,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        data: putData
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
  Admin.$inject = [
    '$http',
    '$q',
    '$rootScope',
    'APP_CONFIG',
    '$state'
  ];
  angular.module('baram.admin.service.Admin', []).factory('Admin', Admin);
}());