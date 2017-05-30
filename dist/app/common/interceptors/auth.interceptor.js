(function () {
  'use strict';
  function AuthInterceptor($q, $injector, $rootScope, $state) {
    // var AuthService, $http, $cookies, $rootScope, $state;
    return {
      request: function (config) {
        if ($rootScope.isLoggedIn) {
          config.headers.authorization = 'Bearer ' + $rootScope.user.token;
        }
        return config;
      },
      'responseError': responseError
    };
    function responseError(res) {
      // redirect user to signin page if 401 or 403 error occurs
      if (res.status === 401) {
        $rootScope.user = undefined;
        $rootScope.isLoggedIn = false;
        try {
          window.localStorage.user = undefined;
        } catch (e) {
        }
        $state.go('home');
      } else if (res.status === 403)
        $state.go('main.wait');

      return $q.reject(res);
    }
  }

  AuthInterceptor.$inject = [
    '$q',
    '$injector',
    '$rootScope',
    '$state'
  ];
  angular.module('baram.common.interceptor.AuthInterceptor', []).factory('AuthInterceptor', AuthInterceptor);
}());