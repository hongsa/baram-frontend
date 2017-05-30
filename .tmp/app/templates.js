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
