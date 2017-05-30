(function () {
  'use strict';
  angular.module('baram', [
    'ngMessages',
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'angular-loading-bar',
    'angularMoment',
    'angularSpinner',
    'toastr',
    'highcharts-ng',
    'infinite-scroll',
    'angular-jwt',
    // Common
    'baram.common',
    // Home
    'baram.home',
    // Main Layout
    'baram.main',
    // Game Stats
    'baram.gameStats',
    // Board
    'baram.board',
    // Contact
    'baram.contact',
    // User Info
    'baram.userInfo',
    // Wait
    'baram.wait'
  ]);
}());
(function () {
  'use strict';
  function BoardController(Board, UserInfo, jwtHelper, $rootScope, APP_CONFIG, $state) {
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
      Board.postBoard(vm.postData).then(function (response) {
        vm.postData.content = '';
        vm.postData.boardType = false;
        vm.boardDataContainer = [];
        vm.page = 1;
        getBoardList();
      })
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
        console.log(item)
      })
    }

    function onClickPostReply(item) {
      item['replyData']['userId'] = $rootScope.user.userId;
      Board.postReply(item.replyData, item.id).then(function (response) {
        item.replyData.content = '';
        onClickGetReplyList(item, 'first');
        item.reply_count += 1;
      })
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
    '$state'
  ];
  angular.module('baram.board.controller.BoardController', []).controller('BoardController', BoardController);
}());
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
(function () {
  'use strict';
  angular.module('baram.common', [
    // Configs
    'baram.common.config.MainConfig',
    'baram.common.config.HTTPInterceptorsConfig',
    'baram.common.config.ToastConfig',
    // Directives
    'baram.common.directive.headerDirective',
    // Constants
    'baram.common.constant.APP_CONFIG',
    // Interceptors
    'baram.common.interceptor.AuthInterceptor',
    // Runs
    'baram.common.run.FetchUserFromLocalStorageRun',
    'baram.common.run.RouterPermissionRun',
    // Filters
    'baram.common.filter.percentage',
    'baram.common.filter.titleCase',
    'baram.common.filter.dateString',
    'baram.common.filter.jobFilter',
    'baram.common.filter.timeDiffFilter',
    // Utils
    'baram.common.utils.LinechartUtils'
  ]);
}());
(function () {
  'use strict';
  function HTTPInterceptorsConfig($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }
  HTTPInterceptorsConfig.$inject = ['$httpProvider'];
  angular.module('baram.common.config.HTTPInterceptorsConfig', []).config(HTTPInterceptorsConfig);
}());
(function () {
  'use strict';
  function MainConfig($urlRouterProvider, $qProvider) {
    // $qProvider.errorOnUnhandledRejections(false);
    $urlRouterProvider.otherwise('/');
  }
  MainConfig.$inject = ['$urlRouterProvider', '$qProvider'];
  angular.module('baram.common.config.MainConfig', []).config(MainConfig);
}());
(function () {
  'use strict';
  function ToastConfig(toastrConfig) {
    angular.extend(toastrConfig, {
      autoDismiss: true,
      containerId: 'toast-container',
      extendedTimeOut: 500,
      timeOut: 1500,
      maxOpened: 0,
      newestOnTop: true,
      positionClass: 'toast-top-full-width',
      preventDuplicates: false,
      preventOpenDuplicates: false,
      target: 'body'
    });
  }

  ToastConfig.$inject = ['toastrConfig'];
  angular.module('baram.common.config.ToastConfig', []).config(ToastConfig);
}());
(function () {
  'use strict';
  angular.module('baram.common.constant.APP_CONFIG', []).constant('APP_CONFIG', {
    'LOCAL': 'http://localhost:8080/api/v2',
    'BACKEND_ADDRESS': 'http://localhost:5000/api/',
    'LIMIT_COUNT' : 20,
    'DAY_MS': 86400000,
    'COLORS': ['#F44336', '#2196F3', '#FFC107', '#9C27B0', '#009688', '#FF5722',
      '#00BCD4', '#CDDC39', '#673AB7', '#4CAF50', '#E91E63', '#3F51B5',
      '#FF9800', '#795548', '#8BC34A', '#000000']
  });
}());
(function () {
  'use strict';
  function Controller($rootScope, $state) {
    var vm = this;

    vm.navFilter = $state.current.name;
    vm.onClickNavigation = onClickNavigation;
    vm.isNavigationActive = isNavigationActive;

    if ($rootScope.user) {
      vm.gameName = $rootScope.user.gameName;
    }

    function onClickNavigation(navFilter) {
      vm.navFilter = navFilter;
    }

    function isNavigationActive(navFilter) {
      if (vm.navFilter === navFilter) {
        return { 'color':'#fe4b60' };
      }
    }
  }

  Controller.$inject = [
    '$rootScope',
    '$state'
  ];
  function headerDirective() {
    return {
      templateUrl: 'app/common/directives/header/header.html',
      restrict: 'E',
      replace: true,
      controller: Controller,
      controllerAs: 'vm'
    };
  }
  angular.module('baram.common.directive.headerDirective', []).directive('header', headerDirective);
}());
(function () {
  'use strict';
  var dateNames = {
    '0': '일요일',
    '1': '월요일',
    '2': '화요일',
    '3': '수요일',
    '4': '목요일',
    '5': '금요일',
    '6': '토요일'
  };
  function dateFilter() {
    return function (input) {
      return dateNames[new Date(input).getDay()];
    };
  }
  angular.module('baram.common.filter.dateString', []).filter('dateString', dateFilter);
}());
(function () {
  'use strict';
  var jobNames = {
    'all': '전체',
    'knight': '전사',
    'thief': '도적',
    'archer': '궁사',
    'god': '천인',
    'magician': '주술사',
    'black-magician': '마도사',
    'priest': '도사'
  };
  function jobFilter() {
    return function (input) {
      return jobNames[input];
    };
  }
  angular.module('baram.common.filter.jobFilter', []).filter('jobFilter', jobFilter);
}());
(function () {
  'use strict';
  function percentageFilter($filter) {
    return function (input, decimals) {
      return $filter('number')(input * 100, decimals) + '%';
    };
  }
  percentageFilter.$inject = ["$filter"];
  angular.module('baram.common.filter.percentage', []).filter('percentage', percentageFilter);
}());
(function () {
  'use strict';
  var timeNames = {
    'minutes ago': '분',
    'hours ago': '시간',
    'days ago': '일',
    'a few seconds ago': '몇초',
    'a minute ago': '1분',
    'a hour ago': '1시간',
    'a day ago': '1일'

  };
  function timeDiffFilter() {
    return function (input) {
      for (var obj in timeNames) {
        if (input === obj) {
          return timeNames[obj] + ' 전';
        } else if (input.includes(obj)) {
          return input.replace(' ', '').replace(obj, timeNames[obj]) + ' 전'
        }

      }
    };
  }
  angular.module('baram.common.filter.timeDiffFilter', []).filter('timeDiffFilter', timeDiffFilter);
}());
(function () {
  'use strict';
  function titleCaseFilter() {
    return function (input) {
      input = input || '';
      return input.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };
  }
  angular.module('baram.common.filter.titleCase', []).filter('titleCase', titleCaseFilter);
}());
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
(function () {
  'use strict';
  function FetchUserFromLocalStorageRun($rootScope) {
    moment.locale('en');
    try {
      $rootScope.user = JSON.parse(window.localStorage.user);
      if ($rootScope.user) {
        $rootScope.isLoggedIn = true;
      } else {
      }
    } catch (e) {
    }
  }
  FetchUserFromLocalStorageRun.$inject = [
    '$rootScope'
  ];
  angular.module('baram.common.run.FetchUserFromLocalStorageRun', []).run(FetchUserFromLocalStorageRun);
}());
(function () {
  'use strict';
  function RouterPermissionRun($rootScope, $transitions) {

    $transitions.onBefore({ to: 'home'}, function(trans) {
      if ($rootScope.isLoggedIn) {
        console.log('already logged in');
        return trans.router.stateService.target('main.gameStats');
      }
    });

    $transitions.onBefore({ to: 'main.**'}, function(trans) {
      if (!$rootScope.isLoggedIn) {
        console.log('login required');
        return trans.router.stateService.target('home');
      }
    });
  }
  RouterPermissionRun.$inject = [
    '$rootScope',
    '$transitions'
  ];
  angular.module('baram.common.run.RouterPermissionRun', []).run(RouterPermissionRun);
}());
(function() {
  'use strict';

  function LinechartUtils(APP_CONFIG) {
    return {
      LineChartConfig: LineChartConfig,
    };

    function LineChartConfig(dataSeries, func, tooltipShared, dateFormat) {
      this.options = {
        chart: {
          type: 'line'
        },
        tooltip: {
          xDateFormat: dateFormat || '%d, %Y',
          shared: tooltipShared || false
        },
        plotOptions: {
          series: {
            events: {
              legendItemClick: (func || function() {})
            }
          }
        },
        colors: APP_CONFIG.COLORS,
        loading: {
          labelStyle: {
            color: 'white'
          },
          style: {
            backgroundColor: 'gray'
          },
          hideDuration: 1000,
          showDuration: 1000
        }
      };
      this.title = {
        text: null
      };
      this.xAxis = {
        type: 'datetime'
      };
      this.yAxis = {
        title: null
      };
      this.series = dataSeries;
    }
  }

  LinechartUtils.$inject = ['APP_CONFIG'];

  angular.module('baram.common.utils.LinechartUtils', [])
    .factory('LinechartUtils', LinechartUtils);
})();
(function () {
  'use strict';
  angular.module('baram.contact', [
    // Router
    'baram.contact.ContactRouter'
  ]);
}());
(function () {
  'use strict';
  function ContactRouter($stateProvider) {
    $stateProvider.state('main.contact', {
      templateUrl: 'app/contact/contact.html',
      url: '/contact'
    });
  }
  ContactRouter.$inject = ['$stateProvider'];
  angular.module('baram.contact.ContactRouter', []).config(ContactRouter);
}());
(function () {
  'use strict';
  function GameStatsController(GameStats, StatsDetail, UserInfo, jwtHelper, $rootScope, APP_CONFIG, $state) {
    var vm = this;
    vm.currentPage = 1;
    vm.totalItem = 0;
    vm.paginationSize = 24;
    vm.jobFilter = 'all';
    vm.gameStatsData = [];
    vm.dataContainer = [];

    vm.onClickJobFilter = onClickJobFilter;
    vm.pageChanged = pageChanged;
    vm.onClickDetailModal = onClickDetailModal;
    vm.isJobFilterActive = isJobFilterActive;

    init();
    function init() {
      var expireDate = jwtHelper.getTokenExpirationDate($rootScope.user.token).getTime();
      var now = new Date().getTime();
      if (expireDate - now <= APP_CONFIG.DAY_MS) {
        updateToken();
      } else {
        getGameStats();
      }
    }

    function updateToken() {
      UserInfo.updateToken($rootScope.user.userId).then(function (response) {
        $rootScope.isLoggedIn = true;
        $rootScope.user = JSON.parse(window.localStorage.user);
        console.log('update token success');
        if ($rootScope.user.level !== -1) {
          getGameStats();
        } else {
          $state.go('main.wait')
        }
      })
    }

    function getGameStats() {
      vm.gameStatsData.splice(0);
      GameStats.getGameStats(vm.gameStatsData, vm.jobFilter).then(function (response) {
        if (response.code === 200) {
          vm.gameStatsData.reverse();
          vm.totalItem = vm.gameStatsData.length;
          pageChanged(1)
        }
      })
    }

    function pageChanged(currentPage) {
      vm.currentPage = currentPage;
      vm.dataContainer.splice(0);
      var start = (vm.currentPage - 1) * vm.paginationSize;

      for (var i = start; i < start + vm.paginationSize; i++) {
        if(i === vm.totalItem) {
          break;
        }
        vm.dataContainer.push({
            'level' : vm.gameStatsData[i].level,
            'gameName' : vm.gameStatsData[i].game_name,
            'ranking' : vm.gameStatsData[i].ranking,
            'job' : vm.gameStatsData[i].job,
            'grade' : vm.gameStatsData[i].grade,
            'weapon' : vm.gameStatsData[i].weapon,
            'body' : vm.gameStatsData[i].body,
            'head' : vm.gameStatsData[i].head
      });
      }
    }

    function onClickDetailModal (gameName) {
      StatsDetail.open(gameName);
    }

    function onClickJobFilter(job) {
      vm.jobFilter = job;
      getGameStats();
    }

    function isJobFilterActive(jobFilter) {
      if (vm.jobFilter === jobFilter){
        return { 'color':'#fe4b60' };
      }
    }

  }

  GameStatsController.$inject = [
    'GameStats',
    'StatsDetail',
    'UserInfo',
    'jwtHelper',
    '$rootScope',
    'APP_CONFIG',
    '$state'
  ];
  angular.module('baram.gameStats.controller.GameStatsController', []).controller('GameStatsController', GameStatsController);
}());
(function () {
  'use strict';
  angular.module('baram.gameStats', [
    // Controllers
    'baram.gameStats.controller.GameStatsController',
    'baram.gameStats.controller.StatsDetailController',
    // Services
    'baram.gameStats.service.GameStats',
    'baram.gameStats.service.StatsDetail',
    // Factory
    'baram.gameStats.factory.StatsDetailFactory',

    // Router
    'baram.gameStats.GameStatsRouter'
  ]);
}());
(function () {
  'use strict';
  function GameStatsRouter($stateProvider) {
    $stateProvider.state('main.gameStats', {
      templateUrl: 'app/game-stats/game-stats.html',
      url: '/game-stats',
      controller: 'GameStatsController',
      controllerAs: 'vm',
      authenticate: true
    });
  }
  GameStatsRouter.$inject = ['$stateProvider'];
  angular.module('baram.gameStats.GameStatsRouter', []).config(GameStatsRouter);
}());
(function () {
  'use strict';
  function GameStats($http, $q, $rootScope, APP_CONFIG) {
    return {
      getGameStats: getGameStats
    };
    function getGameStats(dataContainer, jobFilter) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'game/' + jobFilter,
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      }).then(function (response) {
        response.data.forEach(function (row) {
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

  }
  GameStats.$inject = [
    '$http',
    '$q',
    '$rootScope',
    'APP_CONFIG'
  ];
  angular.module('baram.gameStats.service.GameStats', []).factory('GameStats', GameStats);
}());
(function () {
  'use strict';

  function StatsDetailController(StatsDetailFactory, gameName, LinechartUtils, APP_CONFIG) {
    var vm = this;
    vm.gameName = gameName;
    vm.profileImage = "http://baram.nexon.com/Profile/DrawingImgbyID.aspx?loginID=" + vm.gameName + "@연";

    vm.currentPage = 1;
    vm.pageSize = 10;
    vm.totalItem = 0;
    vm.rankingStatsChartData = {
      name: '랭킹',
      data: [],
      id: 'ranking',
      color: APP_CONFIG.COLORS[10]
    };
    vm.levelStatsChartData = {
      name: '레벨',
      data: [],
      id: 'level',
      color: APP_CONFIG.COLORS[2]
    };
    vm.detailStats = {
      game_name: '',
      job: '',
      ranking: 0,
      grade: 4,
      level: 524,
      weapon: '',
      body: '',
      head: '',
      shield: '',
      right_hand: '',
      left_hand: '',
      option1: '',
      option2: '',
    };

    vm.rankingLineChartData = [
      vm.rankingStatsChartData
    ];
    vm.levelLineChartData = [
      vm.levelStatsChartData
    ];

    vm.rankingLineChartConfig = new LinechartUtils.LineChartConfig(vm.rankingLineChartData, null, true);
    vm.levelLineChartConfig = new LinechartUtils.LineChartConfig(vm.levelLineChartData, null, true);

    init();
    function init () {
      console.log('game init');
      getStatsDetail()
    }
    function getStatsDetail() {
      StatsDetailFactory.getStatsDetail(vm.rankingStatsChartData.data, vm.levelStatsChartData.data, vm.detailStats, vm.gameName).then(function (response) {
      })

    }


  }

  StatsDetailController.$inject = [
    'StatsDetailFactory',
    'gameName',
    'LinechartUtils',
    'APP_CONFIG'
  ];

  angular.module('baram.gameStats.controller.StatsDetailController', [])
      .controller('StatsDetailController', StatsDetailController);
})();

(function () {
  'use strict';
  var dayInMS = 86400000;

  function StatsDetailFactory($http, $q, APP_CONFIG) {
    return {
      getStatsDetail: getStatsDetail
    };

    function getStatsDetail(rankingDataContainer, levelDataContainer, detailStats, gameName) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'game/all/' + gameName,
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
      }).then(function (response) {
        response.data.level_by_date.forEach(function (row) {
          rankingDataContainer.push([
              new Date(row.created).getTime() + (dayInMS/2),
              row.ranking
          ]);
          levelDataContainer.push([
            new Date(row.created).getTime() + (dayInMS/2),
            row.level
          ]);
        });

        angular.copy(response.data.stats, detailStats);
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

  StatsDetailFactory.$inject = ['$http', '$q', 'APP_CONFIG'];

  angular.module('baram.gameStats.factory.StatsDetailFactory', [])
      .factory('StatsDetailFactory', StatsDetailFactory);
})();

(function () {
  'use strict';

  function StatsDetail($uibModal) {
    this.open = function (gameName) {
      return $uibModal.open({
        templateUrl: 'app/game-stats/stats-detail/stats-detail.html',
        controller: 'StatsDetailController',
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          gameName: function () {
            return gameName;
          }
        }
      });
    };
  }

  StatsDetail.$inject = ['$uibModal'];

  angular.module('baram.gameStats.service.StatsDetail', [])
      .service('StatsDetail', StatsDetail);
})();

(function () {
  'use strict';
  function HomeController(Home, $rootScope, $state) {
    var vm = this;
    vm.formType = 'logIn';
    vm.logInData = {
      'loginId': '',
      'password': ''
    };
    vm.signUpData = {
      'logInId': '',
      'password': '',
      'gameName': '',
      'name': '',
      'age': '',
      'phone': '',
      'sex': '',
      'army': ''
    };
    vm.errorText1 = '';
    vm.errorText2 = '';

    vm.showFormType = showFormType;
    vm.onClickLogin = onClickLogin;
    vm.onClickSignUp  = onClickSignUp;

    function showFormType (type) {
      vm.formType = type;
    }
    
    function onClickLogin (valid) {
      if (valid) {
        Home.logIn(vm.logInData).then(function (response) {
          if (response.code === 200) {
            $rootScope.isLoggedIn = true;
            $rootScope.user = JSON.parse(window.localStorage.user);
            if ($rootScope.user.level === -1) {
              $state.go('main.wait');
            } else {
              $state.go('main.gameStats');
            }
          } else {
            vm.errorText1 = response.msg;
          }
        })
      }

    }

    function onClickSignUp (valid) {
      if (valid) {
        Home.signUp(vm.signUpData).then(function (response) {
          if (response.code === 201) {
            $rootScope.isLoggedIn = true;
            $rootScope.user = JSON.parse(window.localStorage.user);
            if ($rootScope.user.level === -1) {
              $state.go('main.wait');
            } else {
              $state.go('main.gameStats');
            }
          } else {
            vm.errorText2 = response.msg;
          }
        })
      }
    }

  }
  HomeController.$inject = [
    'Home',
    '$rootScope',
    '$state'
  ];
  angular.module('baram.home.controller.HomeController', []).controller('HomeController', HomeController);
}());
(function () {
  'use strict';
  angular.module('baram.home', [
    // Controllers
    'baram.home.controller.HomeController',
    // Services
    'baram.home.service.Home',
    // Router
    'baram.home.HomeRouter'
  ]);
}());
(function () {
  'use strict';
  function HomeRouter($stateProvider) {
    $stateProvider.state('home', {
      templateUrl: 'app/home/home.html',
      url: '/',
      controller: 'HomeController',
      controllerAs: 'vm',
      authenticate: true
    });
  }
  HomeRouter.$inject = ['$stateProvider'];
  angular.module('baram.home.HomeRouter', []).config(HomeRouter);
}());
(function () {
  'use strict';
  function Home($http, $q, $rootScope, APP_CONFIG) {
    return {
      signUp: signUp,
      logIn: logIn,
      signOut: signOut
    };
    function signUp(signUpData) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'users/signup',
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        data: signUpData
      }).then(function (response) {
        var tmp = {};
        tmp.userId = response.data.user_id;
        tmp.gameName = response.data.game_name;
        tmp.level = response.data.level;
        tmp.token = response.data.token;
        window.localStorage.user = JSON.stringify(tmp);
        deferred.resolve({
          code: response.status,
          msg: response.data.msg
        });
      }, function (err) {
        deferred.resolve({
          code: err.status,
          msg: err.data.msg
        });
      }, deferred.reject);
      return deferred.promise;
    }
    function logIn(logInData) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'users/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        data: logInData
      }).then(function (response) {
        var tmp = {};
        tmp.userId = response.data.user_id;
        tmp.gameName = response.data.game_name;
        tmp.level = response.data.level;
        tmp.token = response.data.token;
        window.localStorage.user = JSON.stringify(tmp);
        deferred.resolve({
          code: response.status,
          msg: response.data.msg
        });
      }, function (err) {
        deferred.resolve({
          code: err.status,
          msg: err.data.msg
        });
      }, deferred.reject);
      return deferred.promise;
    }
    function signOut() {
      $rootScope.user = undefined;
      $rootScope.isLoggedIn = false;
      try {
        window.localStorage.user = undefined;
      } catch (e) {
      }
      $rootScope.$broadcast('signOut', 'success');
    }
  }
  Home.$inject = [
    '$http',
    '$q',
    '$rootScope',
    'APP_CONFIG'
  ];
  angular.module('baram.home.service.Home', []).factory('Home', Home);
}());
(function () {
  'use strict';
  angular.module('baram.main', [
    // Router
    'baram.main.MainRouter'
  ]);
}());
(function () {
  'use strict';
  function MainRouter($stateProvider) {
    $stateProvider.state('main', {
      templateUrl: 'app/main/main.html',
      url: '/main',
      authenticate: true
    });
  }
  MainRouter.$inject = ['$stateProvider'];
  angular.module('baram.main.MainRouter', []).config(MainRouter);
}());
(function () {
  'use strict';
  function UserInfoController(UserInfo, StatsDetailFactory, $rootScope, APP_CONFIG, LinechartUtils) {
    var vm = this;
    vm.currentPage = 1;
    vm.pageSize = 10;
    vm.totalItem = 0;
    vm.rankingStatsChartData = {
      name: '랭킹',
      data: [],
      id: 'ranking',
      color: APP_CONFIG.COLORS[10]
    };
    vm.levelStatsChartData = {
      name: '레벨',
      data: [],
      id: 'level',
      color: APP_CONFIG.COLORS[2]
    };
    vm.detailStats = {
      game_name: '',
      job: '',
      ranking: 0,
      grade: 4,
      level: 524,
      weapon: '',
      body: '',
      head: '',
      shield: '',
      right_hand: '',
      left_hand: '',
      option1: '',
      option2: '',
    };

    vm.rankingLineChartData = [
      vm.rankingStatsChartData
    ];
    vm.levelLineChartData = [
      vm.levelStatsChartData
    ];

    vm.rankingLineChartConfig = new LinechartUtils.LineChartConfig(vm.rankingLineChartData, null, true);
    vm.levelLineChartConfig = new LinechartUtils.LineChartConfig(vm.levelLineChartData, null, true);

    vm.onClickLogOut = onClickLogOut;

    init();
    function init () {
      if ($rootScope.user) {
        vm.gameName = $rootScope.user.gameName;
        vm.profileImage = "http://baram.nexon.com/Profile/DrawingImgbyID.aspx?loginID=" + vm.gameName + "@연";
      }
      getStatsDetail()
    }
    function getStatsDetail() {
      StatsDetailFactory.getStatsDetail(vm.rankingStatsChartData.data, vm.levelStatsChartData.data, vm.detailStats, vm.gameName).then(function (response) {
      })
    }

    function onClickLogOut() {
      UserInfo.logOut();
    }
  }
  UserInfoController.$inject = [
    'UserInfo',
    'StatsDetailFactory',
    '$rootScope',
    'APP_CONFIG',
    'LinechartUtils'
  ];
  angular.module('baram.userInfo.controller.UserInfoController', []).controller('UserInfoController', UserInfoController);
}());
(function () {
  'use strict';
  angular.module('baram.userInfo', [
    // Controllers
    'baram.userInfo.controller.UserInfoController',
    // Services
    'baram.userInfo.service.UserInfo',
    // Router
    'baram.userInfo.UserInfoRouter'
  ]);
}());
(function () {
  'use strict';
  function UserInfoRouter($stateProvider) {
    $stateProvider.state('main.userInfo', {
      templateUrl: 'app/user-info/user-info.html',
      url: '/user-info',
      controller: 'UserInfoController',
      controllerAs: 'vm',
      authenticate: true
    });
  }
  UserInfoRouter.$inject = ['$stateProvider'];
  angular.module('baram.userInfo.UserInfoRouter', []).config(UserInfoRouter);
}());
(function () {
  'use strict';
  function UserInfo($http, $q, $rootScope, APP_CONFIG, $state) {
    return {
      logOut: logOut,
      updateToken: updateToken
    };

    function logOut() {
      $rootScope.user = undefined;
      $rootScope.isLoggedIn = false;
      try {
        window.localStorage.user = undefined;
      } catch (e) {
      }
      $state.go('home')
    }

    function updateToken(userId) {
      var deferred = $q.defer();
      $http({
        url: APP_CONFIG.BACKEND_ADDRESS + 'auth/' + userId,
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      }).then(function (response) {
        var tmp = {};
        tmp.userId = response.data.user_id;
        tmp.gameName = response.data.game_name;
        tmp.level = response.data.level;
        tmp.token = response.data.token;
        window.localStorage.user = JSON.stringify(tmp);
        deferred.resolve({
          code: response.status,
          msg: response.data.msg
        });
      }, function (err) {
        deferred.resolve({
          code: err.status,
          msg: err.data.msg
        });
      }, deferred.reject);
      return deferred.promise;
    }

  }
  UserInfo.$inject = [
    '$http',
    '$q',
    '$rootScope',
    'APP_CONFIG',
    '$state'
  ];
  angular.module('baram.userInfo.service.UserInfo', []).factory('UserInfo', UserInfo);
}());
(function () {
  'use strict';
  function WaitController(UserInfo, $rootScope, $state) {
    var vm = this;

    vm.onClickLogOut = onClickLogOut;

    init();
    function init () {
      if ($rootScope.user) {
        vm.gameName = $rootScope.user.gameName;
        updateToken();
      }
    }

    function onClickLogOut() {
      UserInfo.logOut();
    }

    function updateToken() {
      UserInfo.updateToken($rootScope.user.userId).then(function (response) {
        $rootScope.isLoggedIn = true;
        $rootScope.user = JSON.parse(window.localStorage.user);
        console.log('update token success');
        if ($rootScope.user.level !== -1) {
          $state.go('main.gameStats')
        }
      })
    }

  }
  WaitController.$inject = [
    'UserInfo',
    '$rootScope',
    '$state'
  ];
  angular.module('baram.wait.controller.WaitController', []).controller('WaitController', WaitController);
}());
(function () {
  'use strict';
  angular.module('baram.wait', [
    'baram.wait.controller.WaitController',
      // Router
    'baram.wait.WaitRouter'
  ]);
}());
(function () {
  'use strict';
  function WaitRouter($stateProvider) {
    $stateProvider.state('main.wait', {
      templateUrl: 'app/wait/wait.html',
      url: '/wait',
      controller: 'WaitController',
      controllerAs: 'vm'
    });
  }
  WaitRouter.$inject = ['$stateProvider'];
  angular.module('baram.wait.WaitRouter', []).config(WaitRouter);
}());
angular.module('baram').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/board/board.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-3 col-sm-2 col-xs-1\"></div>\n" +
    "\n" +
    "  <div class=\"col-md-6 col-sm-8 col-xs-10\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-md-12 col-sm-12 col-xs-12\">\n" +
    "        <div class=\"col-md-6 col-sm-6 col-xs-6 board-sub-menu job-filter text-center\"\n" +
    "             ng-style=\"vm.isBoardFilterActive('normal')\"\n" +
    "             ng-click=\"vm.onClickBoardFilter('normal')\">게시글\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-sm-6 col-xs-6 board-sub-menu job-filter text-center\"\n" +
    "             ng-style=\"vm.isBoardFilterActive('notice')\"\n" +
    "             ng-click=\"vm.onClickBoardFilter('notice')\">공지사항\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\" style=\"margin-bottom: 10px;\"\n" +
    "         ng-if=\"vm.boardFilter === 'notice' && vm.userLevel == 1 || vm.boardFilter === 'normal'\">\n" +
    "      <div class=\"col-sm-12\">\n" +
    "        <textarea class=\"form-control\" rows=\"4\" name=\"content\"\n" +
    "                  ng-model=\"vm.postData.content\" placeholder=\"호걸은 호걸을 알아보는 법\"></textarea>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-12 text-right\">\n" +
    "        <button type=\"submit\" class=\"btn btn-default\" ng-if=\"vm.boardFilter === 'normal'\"\n" +
    "                ng-click=\"vm.onClickPostBoard('normal')\">\n" +
    "          <span class=\"glyphicon glyphicon-pencil\"></span>&nbsp;글쓰기\n" +
    "        </button>\n" +
    "        <button type=\"submit\" class=\"btn btn-default\"\n" +
    "                ng-if=\"vm.boardFilter === 'notice' && vm.userLevel == 1\"\n" +
    "                ng-click=\"vm.onClickPostBoard('notice')\">\n" +
    "          <span class=\"glyphicon glyphicon-pencil\"></span>&nbsp;공지쓰기\n" +
    "        </button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div infinite-scroll=\"vm.getBoardList()\" infinite-scroll-disabled=\"vm.busy\"\n" +
    "         infinite-scroll-distance=\"3\">\n" +
    "      <div ng-repeat=\"item in vm.boardDataContainer\" style=\"margin-bottom: 10px;\">\n" +
    "        <div class=\"row board-box\">\n" +
    "          <div class=\"row\" style=\"margin-bottom: 10px;\">\n" +
    "            <div class=\"col-xs-2 col-sm-1 col-md-1\">\n" +
    "              <img style=\"width: 40px; height: 56px;\"\n" +
    "                   src=\"http://baram.nexon.com/Profile/DrawingImgbyID.aspx?loginID={{item.game_name}}@연\"\n" +
    "                   alt=\"\">\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-10 col-sm-11 col-md-11\">\n" +
    "              <div class=\"board-game-name\">{{item.game_name}}</div>\n" +
    "              <div class=\"board-time\">{{item.timeDiff}}</div>\n" +
    "              <div class=\"board-notice\" ng-if=\"item.notice\">*공지*</div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"row\" style=\"margin-bottom: 10px;\">\n" +
    "            <div class=\"col-xs-12 board-content\" ng-style=\"item.more === false && {'max-height':'30em'}\">{{item.content}}</div>\n" +
    "            <div class=\"col-xs-12 board-more-text\" ng-if=\"item.more\" ng-click=\"vm.onClickTextExpand(item)\">더 보기\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-12 board-reply-count text-right\" ng-if=\"item.reply_count > 0\"\n" +
    "                 ng-click=\"vm.onClickGetReplyList(item, 'first')\">댓글 {{item.reply_count}} 개\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row reply-box\">\n" +
    "          <div class=\"row\" style=\"margin-bottom: 10px;\">\n" +
    "            <div class=\"col-xs-2 col-sm-1 col-md-1\">\n" +
    "              <img style=\"width: 30px; height: 43px;\"\n" +
    "                   src=\"http://baram.nexon.com/Profile/DrawingImgbyID.aspx?loginID={{vm.gameName}}@연\"\n" +
    "                   alt=\"\">\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-10 col-sm-11 col-md-11\">\n" +
    "              <input type=\"text\" class=\"col-xs-9 col-sm-10 col-md-10 form-control reply-write-input\"\n" +
    "                     placeholder=\"댓글을 입력하세요\" ng-model=\"item.replyData.content\">\n" +
    "              <div class=\"col-xs-3 col-sm-2 col-md-2 reply-write text-center\"\n" +
    "                   ng-click=\"vm.onClickPostReply(item)\">게시\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"row\" ng-repeat=\"reply in item.replyContainer\" style=\"margin-bottom: 10px;\">\n" +
    "            <div class=\"col-xs-2 col-sm-1 col-md-1\">\n" +
    "              <img style=\"width: 30px; height: 43px;\"\n" +
    "                   src=\"http://baram.nexon.com/Profile/DrawingImgbyID.aspx?loginID={{reply.game_name}}@연\"\n" +
    "                   alt=\"\">\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-10 col-sm-11 col-md-11\" style=\"padding: 10px;\">\n" +
    "              <div>\n" +
    "                <span class=\"reply-game-name\">{{reply.game_name}}</span>\n" +
    "                <span class=\"reply-content\">{{reply.content}}</span>\n" +
    "              </div>\n" +
    "              <div class=\"board-time\">{{reply.timeDiff | timeDiffFilter}}</div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"board-more-text\"\n" +
    "               ng-if=\"(item.reply_count - item.replyRequest) > 0 && item.replyRequest > 0\"\n" +
    "               ng-click=\"vm.onClickGetReplyList(item, 'more')\">댓글 더 보기\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "  <div class=\"col-md-3 col-sm-2 col-xs-1\"></div>\n"
  );


  $templateCache.put('app/common/directives/header/header.html',
    "<nav class=\"navbar navbar-default\" role=\"navigation\">\n" +
    "  <!-- 모바일 전환시 생기는 네비게이션 바 -->\n" +
    "  <div class=\"container\">\n" +
    "    <div class=\"navbar-header\">\n" +
    "      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\"\n" +
    "              data-target=\"#bs-example-navbar-collapse-1\">\n" +
    "        <span class=\"sr-only\">Toggle navigation</span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "      </button>\n" +
    "\n" +
    "      <!-- 웹사이트 네비게이션 바 안의 로고 부분부터 -->\n" +
    "      <a class=\"navbar-brand\" ui-sref=\"home\">\n" +
    "        <span style=\"color: #fe4b60; font-weight: bold; font-size: 21px;\">팔도</span>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- 네비게이션 링크 제목들 -->\n" +
    "    <div class=\"collapse navbar-collapse text-center\" id=\"bs-example-navbar-collapse-1\">\n" +
    "\n" +
    "      <ul class=\"nav navbar-nav navbar-left\" style=\"color: #666666;\">\n" +
    "        <li>\n" +
    "          <a ui-sref=\"main.gameStats\" ng-click=\"vm.onClickNavigation('main.gameStats')\">\n" +
    "            <span ng-style=\"vm.isNavigationActive('main.gameStats')\">문원정보</span></a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "          <a ui-sref=\"main.board\" ng-click=\"vm.onClickNavigation('main.board')\">\n" +
    "            <span ng-style=\"vm.isNavigationActive('main.board')\">게시판</span></a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "\n" +
    "      <ul class=\"nav navbar-nav navbar-right\" style=\"color: #666666;\">\n" +
    "        <li>\n" +
    "          <a ui-sref=\"main.userInfo\" ng-click=\"vm.onClickNavigation('main.userInfo')\">\n" +
    "            <span ng-style=\"vm.isNavigationActive('main.userInfo')\">{{vm.gameName}}&nbsp;님</span></a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "          <a ui-sref=\"main.contact\" ng-click=\"vm.onClickNavigation('main.contact')\">\n" +
    "            <span ng-style=\"vm.isNavigationActive('main.contact')\" >문의</span></a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div><!-- /.navbar-collapse -->\n" +
    "  </div>\n" +
    "</nav>"
  );


  $templateCache.put('app/contact/contact.html',
    "<div class=\"container\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-lg-12\">\n" +
    "      <div>문의 및 건의사항은 scvhss@naver.com <br> 혹은 \"비빔맹구\"로 바람 쪽지 보내주세요~</div>\n" +
    "\n" +
    "      <p class=\"copyright text-muted small\">Copyright &copy; 비빔맹구. All Rights Reserved / 문의 :\n" +
    "        scvhss@naver.com</p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('app/game-stats/game-stats.html',
    "<div class=\"container\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "      <div class=\"row text-center\">\n" +
    "        <span class=\"job-filter\" ng-style=\"vm.isJobFilterActive('all')\" ng-click=\"vm.onClickJobFilter('all')\">전체</span>\n" +
    "        <span class=\"job-filter\" ng-style=\"vm.isJobFilterActive('knight')\" ng-click=\"vm.onClickJobFilter('knight')\">전사</span>\n" +
    "        <span class=\"job-filter\" ng-style=\"vm.isJobFilterActive('thief')\" ng-click=\"vm.onClickJobFilter('thief')\">도적</span>\n" +
    "        <span class=\"job-filter\" ng-style=\"vm.isJobFilterActive('archer')\" ng-click=\"vm.onClickJobFilter('archer')\">궁사</span>\n" +
    "        <span class=\"job-filter\" ng-style=\"vm.isJobFilterActive('god')\" ng-click=\"vm.onClickJobFilter('god')\">천인</span>\n" +
    "        <span class=\"job-filter\" ng-style=\"vm.isJobFilterActive('magician')\" ng-click=\"vm.onClickJobFilter('magician')\">주술사</span>\n" +
    "        <span class=\"job-filter\" ng-style=\"vm.isJobFilterActive('priest')\" ng-click=\"vm.onClickJobFilter('priest')\">도사</span>\n" +
    "        <span class=\"job-filter\" ng-style=\"vm.isJobFilterActive('black-magician')\" ng-click=\"vm.onClickJobFilter('black-magician')\">마도사</span>\n" +
    "      </div>\n" +
    "      <hr>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-3 col-xs-4 card-item-box thumbnail\" ng-repeat=\"(idx, item) in vm.dataContainer\" ng-click=\"vm.onClickDetailModal(item.gameName)\">\n" +
    "          <img class=\"img-responsive\" src=\"http://baram.nexon.com/Profile/DrawingImgbyID.aspx?loginID={{item.gameName}}@연\" alt=\"\">\n" +
    "          <div class=\"job-ranking text-center\">\n" +
    "            <!--{{vm.jobFilter | jobFilter}}<br>-->\n" +
    "            {{(vm.paginationSize * (vm.currentPage-1)) + idx + 1}}위\n" +
    "          </div>\n" +
    "          <div class=\"caption\">\n" +
    "            <div class=\"card-item-info text-center\">\n" +
    "              <div class=\"card-item-title\">{{item.gameName}}</div>\n" +
    "              <div class=\"card-item-weapon\">{{item.weapon}}</div>\n" +
    "              <div class=\"card-item-job\">{{item.job}}&nbsp;({{item.grade}}차)</div>\n" +
    "              <div class=\"card-item-level\">LV {{item.level}}&nbsp;({{item.ranking}}위)</div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "      <div class=\"text-center\">\n" +
    "        <uib-pagination boundary-links=\"true\" total-items=\"vm.totalItem\" ng-model=\"vm.currentPage\"\n" +
    "                        ng-change=\"vm.pageChanged(vm.currentPage)\" items-per-page=\"24\" max-size=\"10\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\"></uib-pagination>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('app/game-stats/stats-detail/stats-detail.html',
    "<div class=\"modal-header\">\n" +
    "  <button type=\"button\" class=\"close\" ng-click=\"$dismiss()\"><span aria-hidden=\"true\">&times;</span>\n" +
    "  </button>\n" +
    "  <h3 class=\"modal-title text-center\">{{vm.gameName}}</h3>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "  <div>\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-md-6 col-xs-6\">\n" +
    "        <highchart config=\"vm.levelLineChartConfig\"></highchart>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-6 col-xs-6\">\n" +
    "        <highchart config=\"vm.rankingLineChartConfig\"></highchart>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div>\n" +
    "    <div class=\"row\" style=\"margin: 10px;\">\n" +
    "      <div class=\"col-md-3 col-xs-5\">\n" +
    "        <div class=\"card-item-box thumbnail\">\n" +
    "          <img src={{vm.profileImage}} alt=\"\">\n" +
    "          <div class=\"caption\">\n" +
    "            <div class=\"card-item-info text-center\">\n" +
    "              <div class=\"card-item-title\">{{vm.detailStats.game_name}}</div>\n" +
    "              <div class=\"card-item-job\">{{vm.detailStats.job}}&nbsp;({{vm.detailStats.grade}}차)\n" +
    "              </div>\n" +
    "              <div class=\"card-item-level\">LV {{vm.detailStats.level}}&nbsp;({{vm.detailStats.ranking}}위)</div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"col-md-9 col-xs-7\">\n" +
    "        <div class=\"card-item-info text-left\">\n" +
    "          <div class=\"card-item-weapon\">무기 : {{vm.detailStats.weapon}}</div>\n" +
    "          <div class=\"card-item-weapon\">갑옷 : {{vm.detailStats.body}}</div>\n" +
    "          <div class=\"card-item-weapon\">투구 : {{vm.detailStats.head}}</div>\n" +
    "          <div class=\"card-item-weapon\">방패 : {{vm.detailStats.shield}}</div>\n" +
    "          <div class=\"card-item-weapon\">오른손 : {{vm.detailStats.right_hand}}</div>\n" +
    "          <div class=\"card-item-weapon\">왼손 : {{vm.detailStats.left_hand}}</div>\n" +
    "          <div class=\"card-item-weapon\">악세사리 : {{vm.detailStats.option1}}</div>\n" +
    "          <div class=\"card-item-weapon\">악세사리 : {{vm.detailStats.option2}}</div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button type=\"button\" class=\"btn btn-primary\" ng-click=\"$dismiss()\">닫기</button>\n" +
    "</div>\n"
  );


  $templateCache.put('app/home/home.html',
    "<div class=\"intro-header\">\n" +
    "  <div class=\"container\">\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-lg-12\">\n" +
    "        <div class=\"intro-message\">\n" +
    "          <h3 class=\"text-center\" ui-sref=\"home\">팔도</h3>\n" +
    "          <hr class=\"intro-divider\">\n" +
    "\n" +
    "          <div class=\"col-md-6 col-md-offset-3\">\n" +
    "            <!--logIn Form-->\n" +
    "            <form role=\"form\" name=\"logInForm\" ng-show=\"vm.formType === 'logIn'\"\n" +
    "                  ng-hide=\"vm.formType === 'signUp'\" novalidate>\n" +
    "              <div class=\"row\">\n" +
    "                <div class=\"col-md-9 col-md-offset-3 col-xs-9 col-xs-offset-3\">\n" +
    "                  <p class=\"form-group\">\n" +
    "                    <label>아이디</label>\n" +
    "                    <input name=\"logInId\" ng-model=\"vm.logInData.logInId\" type=\"text\"\n" +
    "                           class=\"form-control\"\n" +
    "                           style=\"width:60%;\" required maxlength=\"12\" minlength=\"4\"/>\n" +
    "                  <div ng-messages=\"logInForm.logInId.$error\" ng-show=\"logInForm.logInId.$dirty\">\n" +
    "                    <div ng-message=\"required\">아이디를 입력해주세요</div>\n" +
    "                    <div ng-message=\"maxlength\">너무 길어요(최대 12자)</div>\n" +
    "                    <div ng-message=\"minlength\">너무 짧아요(최소 4자)</div>\n" +
    "                  </div>\n" +
    "                  </p>\n" +
    "                  <p class=\"form-group\">\n" +
    "                    <label>비밀번호</label>\n" +
    "                    <input name=\"password\" ng-model=\"vm.logInData.password\" type=\"password\"\n" +
    "                           class=\"form-control\"\n" +
    "                           style=\"width:60%;\" required maxlength=\"12\" minlength=\"4\"/>\n" +
    "                  <div ng-messages=\"logInForm.password.$error\" ng-show=\"logInForm.password.$dirty\">\n" +
    "                    <div ng-message=\"required\">비밀번호를 입력해주세요</div>\n" +
    "                    <div ng-message=\"maxlength\">너무 길어요(최대 12자)</div>\n" +
    "                    <div ng-message=\"minlength\">너무 짧아요(최소 4자)</div>\n" +
    "                  </div>\n" +
    "                  </p>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "\n" +
    "              <div class=\"row\">\n" +
    "                <div class=\"col-md-9 col-md-offset-3 col-xs-9 col-xs-offset-3\">\n" +
    "                  <div>\n" +
    "                    <div ng-if=\"vm.errorText1.length != 0\">\n" +
    "                      {{vm.errorText1}}\n" +
    "                    </div>\n" +
    "                    <button class=\"btn btn-danger\" style=\"margin-top:5%;width:60%;\"\n" +
    "                            ng-class=\"{'disabled' : logInForm.$invalid}\"\n" +
    "                            ng-click=\"vm.onClickLogin(logInForm.$valid)\">\n" +
    "                      로그인\n" +
    "                    </button>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "\n" +
    "              <div class=\"row\">\n" +
    "                <div class=\"col-md-9 col-md-offset- col-xs-9 col-xs-offset-3\">\n" +
    "                  <div>\n" +
    "                    <button class=\"btn btn-default\" style=\"margin-top:5%;width:60%;\"\n" +
    "                            ng-click=\"vm.showFormType('signUp')\">\n" +
    "                      회원가입 <span class=\"glyphicon glyphicon-arrow-right\" aria-hidden=\"true\"></span>\n" +
    "\n" +
    "                    </button>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "\n" +
    "            </form>\n" +
    "            <!--logIn Form-->\n" +
    "\n" +
    "            <!--signup form-->\n" +
    "            <form role=\"form\" name=\"signUpForm\" ng-show=\"vm.formType === 'signUp'\"\n" +
    "                  ng-hide=\"vm.formType === 'logIn'\" novalidate>\n" +
    "              <div class=\"row\">\n" +
    "                <div class=\"col-md-9 col-md-offset-3 col-xs-9 col-xs-offset-3\">\n" +
    "                  <p class=\"form-group\">\n" +
    "                    <label>아이디</label>\n" +
    "                    <input name=\"logInId\" ng-model=\"vm.signUpData.loginId\" type=\"text\"\n" +
    "                           class=\"form-control\"\n" +
    "                           style=\"width:60%;\" required maxlength=\"12\" minlength=\"4\"/>\n" +
    "                  </p>\n" +
    "                  <div ng-messages=\"signUpForm.logInId.$error\" ng-show=\"signUpForm.logInId.$dirty\">\n" +
    "                    <div ng-message=\"required\">아이디를 입력해주세요</div>\n" +
    "                    <div ng-message=\"maxlength\">너무 길어요(최대 12자)</div>\n" +
    "                    <div ng-message=\"minlength\">너무 짧아요(최소 4자)</div>\n" +
    "                  </div>\n" +
    "                  <p class=\"form-group\">\n" +
    "                    <label>비밀번호</label>\n" +
    "                    <input name=\"password\" ng-model=\"vm.signUpData.password\" type=\"password\"\n" +
    "                           class=\"form-control\"\n" +
    "                           style=\"width:60%;\" required maxlength=\"12\" minlength=\"4\"/>\n" +
    "                  </p>\n" +
    "                  <div ng-messages=\"signUpForm.password.$error\"\n" +
    "                       ng-show=\"signUpForm.password.$dirty\">\n" +
    "                    <div ng-message=\"required\">비밀번호를 입력해주세요</div>\n" +
    "                    <div ng-message=\"maxlength\">너무 길어요(최대 12자)</div>\n" +
    "                    <div ng-message=\"minlength\">너무 짧아요(최소 4자)</div>\n" +
    "                  </div>\n" +
    "                  <hr>\n" +
    "                  <p class=\"form-group\">\n" +
    "                    <label>바람 아이디</label>\n" +
    "                    <input name=\"gameName\" ng-model=\"vm.signUpData.gameName\" type=\"text\"\n" +
    "                           class=\"form-control\"\n" +
    "                           style=\"width:60%;\" required/>\n" +
    "                  <div ng-messages=\"signUpForm.gameName.$error\"\n" +
    "                       ng-show=\"signUpForm.gameName.$dirty\">\n" +
    "                    <div ng-message=\"required\">바람 아이디 입력해주세요</div>\n" +
    "                  </div>\n" +
    "                  </p>\n" +
    "                  <p class=\"form-group\">\n" +
    "                    <label>이름</label>\n" +
    "                    <input name=\"name\" ng-model=\"vm.signUpData.name\" type=\"text\"\n" +
    "                           class=\"form-control\"\n" +
    "                           style=\"width:60%;\" required/>\n" +
    "                  <div ng-messages=\"signUpForm.name.$error\" ng-show=\"signUpForm.name.$dirty\">\n" +
    "                    <div ng-message=\"required\">실명 입력해주세요</div>\n" +
    "                  </div>\n" +
    "                  </p>\n" +
    "                  <p class=\"form-group\">\n" +
    "                    <label>핸드폰 번호</label>\n" +
    "                    <input name=\"phone\" ng-model=\"vm.signUpData.phone\" type=\"number\"\n" +
    "                           class=\"form-control\"\n" +
    "                           style=\"width:60%;\" required maxlength=\"12\" minlength=\"9\"/>\n" +
    "                  <div ng-messages=\"signUpForm.phone.$error\" ng-show=\"signUpForm.phone.$dirty\">\n" +
    "                    <div ng-message=\"required\">번호를 입력해주세요</div>\n" +
    "                    <div ng-message=\"maxlength\">양식에 맞춰주세요(최대 12자)</div>\n" +
    "                    <div ng-message=\"minlength\">양식에 맞춰주세요(최소 9자)</div>\n" +
    "                  </div>\n" +
    "                  </p>\n" +
    "                  <p class=\"form-group\">\n" +
    "                    <label>나이</label>\n" +
    "                    <input name=\"age\" ng-model=\"vm.signUpData.age\" type=\"number\"\n" +
    "                           class=\"form-control\"\n" +
    "                           style=\"width:60%;\" required/>\n" +
    "                  <div ng-messages=\"signUpForm.age.$error\" ng-show=\"signUpForm.age.$dirty\">\n" +
    "                    <div ng-message=\"required\">나이를 입력해주세요</div>\n" +
    "                  </div>\n" +
    "                  </p>\n" +
    "\n" +
    "                  <p class=\"form-group\">\n" +
    "                    <label>성별&nbsp;&nbsp;</label>\n" +
    "                    <label class=\"radio-inline\">\n" +
    "                      <input ng-model=\"vm.signUpData.sex\" type=\"radio\" value=\"남자\" required>남자\n" +
    "                    </label>\n" +
    "                    <label class=\"radio-inline\">\n" +
    "                      <input ng-model=\"vm.signUpData.sex\" type=\"radio\" value=\"여자\" required>여자\n" +
    "                    </label>\n" +
    "                  </p>\n" +
    "\n" +
    "                  <p class=\"form-group\">\n" +
    "                    <label>군필&nbsp;&nbsp;</label>\n" +
    "                    <label class=\"radio-inline\">\n" +
    "                      <input ng-model=\"vm.signUpData.army\" type=\"radio\" value=\"군필\" required>군필\n" +
    "                    </label>\n" +
    "                    <label class=\"radio-inline\">\n" +
    "                      <input ng-model=\"vm.signUpData.army\" type=\"radio\" value=\"미필\" required>미필\n" +
    "                    </label>\n" +
    "                    <label class=\"radio-inline\">\n" +
    "                      <input ng-model=\"vm.signUpData.army\" type=\"radio\" value=\"면제/공익\" required>면제/공익\n" +
    "                    </label>\n" +
    "                  </p>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "\n" +
    "              <div class=\"row\">\n" +
    "                <div class=\"col-md-9 col-md-offset-3 col-xs-9 col-xs-offset-3\">\n" +
    "                  <div>\n" +
    "                    <div ng-if=\"vm.errorText2.length != 0\">\n" +
    "                      {{vm.errorText2}}\n" +
    "                    </div>\n" +
    "                    <button class=\"btn btn-danger\" style=\"margin-top:5%;width:60%;\"\n" +
    "                            ng-class=\"{'disabled' : signUpForm.$invalid}\" type=\"submit\"\n" +
    "                            ng-click=\"vm.onClickSignUp(signUpForm.$valid)\">\n" +
    "                      가입하기\n" +
    "                    </button>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "\n" +
    "              <div class=\"row\">\n" +
    "                <div class=\"col-md-9 col-md-offset- col-xs-9 col-xs-offset-3\">\n" +
    "                  <div>\n" +
    "                    <button class=\"btn btn-default\" style=\"margin-top:5%;width:60%;\"\n" +
    "                            ng-click=\"vm.showFormType('logIn')\">\n" +
    "                      <span class=\"glyphicon glyphicon-arrow-left\" aria-hidden=\"true\"></span> 로그인\n" +
    "                    </button>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "            </form>\n" +
    "            <!--signup form-->\n" +
    "\n" +
    "          </div>\n" +
    "\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "  <!-- /.container -->\n" +
    "</div>\n" +
    "<!-- /.intro-header -->\n" +
    "\n" +
    "<div class=\"content-section-a\">\n" +
    "\n" +
    "  <div class=\"container\" style=\"margin-top: 50px;\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-lg-5 col-sm-6\">\n" +
    "        <hr class=\"section-heading-spacer\">\n" +
    "        <div class=\"clearfix\"></div>\n" +
    "        <h2 class=\"section-heading\">4성통일을 위해</h2>\n" +
    "        <p class=\"lead\">\n" +
    "          호걸은 호걸을 알아보는 법\n" +
    "        </p>\n" +
    "      </div>\n" +
    "      <div class=\"col-lg-5 col-lg-offset-2 col-sm-6\">\n" +
    "\n" +
    "        <div class=\"container\" style=\"margin-top: 50px;\">\n" +
    "          <div class=\"row\">\n" +
    "            <img class=\"\"\n" +
    "                 src=\"http://baram.nexon.com/Profile/DrawingImgbyID.aspx?loginID=%EB%B9%84%EB%B9%94%EC%B0%B8@%EC%97%B0\"\n" +
    "                 alt=\"\">\n" +
    "            <img class=\"\"\n" +
    "                 src=\"http://baram.nexon.com/Profile/DrawingImgbyID.aspx?loginID=%ED%99%A9%EC%9D%B8%EC%9A%B1@%EC%97%B0\"\n" +
    "                 alt=\"\">\n" +
    "            <img class=\"\"\n" +
    "                 src=\"http://baram.nexon.com/Profile/DrawingImgbyID.aspx?loginID=%ED%81%B0%EC%B4%9D@%EC%97%B0\"\n" +
    "                 alt=\"\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "  <!-- /.container -->\n" +
    "\n" +
    "</div>\n" +
    "<!-- /.content-section-a -->\n" +
    "\n" +
    "<footer>\n" +
    "  <div class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-lg-12\">\n" +
    "        <p class=\"copyright text-muted small\">Copyright &copy; 비빔맹구. All Rights Reserved / 문의 :\n" +
    "          scvhss@naver.com</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</footer>\n" +
    "\n" +
    "<link rel=\"stylesheet\" href=\"styles/landing.css\">"
  );


  $templateCache.put('app/main/main.html',
    "<div>\n" +
    "  <header></header>\n" +
    "  <div>\n" +
    "    <div ui-view></div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('app/user-info/user-info.html',
    "<div class=\"container\">\n" +
    "  <div style=\"margin-bottom: 20px;\">\n" +
    "    <h2 class=\"modal-title text-center card-item-title\">{{vm.gameName}}</h2>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <div class=\"row\" style=\"margin-bottom: 15px;\">\n" +
    "    <div class=\"col-md-6 col-xs-6\">\n" +
    "      <highchart config=\"vm.levelLineChartConfig\"></highchart>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6 col-xs-6\">\n" +
    "      <highchart config=\"vm.rankingLineChartConfig\"></highchart>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-3 col-xs-5\">\n" +
    "      <div class=\"card-item-box thumbnail\">\n" +
    "        <img src={{vm.profileImage}} alt=\"\">\n" +
    "        <div class=\"caption\">\n" +
    "          <div class=\"card-item-info text-center\">\n" +
    "            <div class=\"card-item-title\">{{vm.detailStats.game_name}}</div>\n" +
    "            <div class=\"card-item-job\">{{vm.detailStats.job}}&nbsp;({{vm.detailStats.grade}}차)\n" +
    "            </div>\n" +
    "            <div class=\"card-item-level\">LV {{vm.detailStats.level}}&nbsp;({{vm.detailStats.ranking}}위)</div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-9 col-xs-7\">\n" +
    "      <div class=\"card-item-info text-left\">\n" +
    "        <div class=\"card-item-weapon\">무기 : {{vm.detailStats.weapon}}</div>\n" +
    "        <div class=\"card-item-weapon\">갑옷 : {{vm.detailStats.body}}</div>\n" +
    "        <div class=\"card-item-weapon\">투구 : {{vm.detailStats.head}}</div>\n" +
    "        <div class=\"card-item-weapon\">방패 : {{vm.detailStats.shield}}</div>\n" +
    "        <div class=\"card-item-weapon\">오른손 : {{vm.detailStats.right_hand}}</div>\n" +
    "        <div class=\"card-item-weapon\">왼손 : {{vm.detailStats.left_hand}}</div>\n" +
    "        <div class=\"card-item-weapon\">악세사리 : {{vm.detailStats.option1}}</div>\n" +
    "        <div class=\"card-item-weapon\">악세사리 : {{vm.detailStats.option2}}</div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container row text-right\">\n" +
    "  <button class=\"btn btn-default\" ng-click=\"vm.onClickLogOut()\">로그아웃</button>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('app/wait/wait.html',
    "<div class=\"container\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-lg-12\">\n" +
    "      <div>문주/부문주의 승인을 기다려주세요</div>\n" +
    "    </div>\n" +
    "    <div class=\"container row text-right\">\n" +
    "      <button class=\"btn btn-default\" ng-click=\"vm.onClickLogOut()\">로그아웃</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );

}]);
