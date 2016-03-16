var app = angular.module('JoinContest');
app.controller('JoinContestController', [
  '$scope',
  '$mdSidenav',
	'TeamFactory',
  'JoinContestService',
  function($scope, $mdSidenav, team, joinContest) {
    $scope.password = '';
    $scope.team = {};

    $scope.teams = [];

    joinContest.callback = function(contest) {
      $scope.role = '';
      $scope.password = '';
      $scope.team = {};

      $scope.contest = contest;
      if (contest.contestantType === 1) {
        $scope.role = 'individual';
      } else if (contest.contestantType === 2) {
        $scope.role = 'team';
      }
    }

    var fetchTeams = function() {
      team.getFromUser({})
        .then(function(data) {
          $scope.teams = data.teams.map(function(obj) {
            return {
              id: obj._id,
              name: obj.name
            };
          });
        });
    }
    fetchTeams();

    $scope.close = function() {
      $mdSidenav('right').close();
    };

    $scope.setJoinContestData = function(contest) {
      if ($scope.isCollapsed || $scope.curContest._id != contest._id) {
        if (contest.contestantType == '2') {
          if ($scope.teams.length === 0) {
            Notification.error('Esta competição só permite times, e você não está em nenhum.');
            return;
          } else {
            $scope.joinContest.team = $scope.teams[0].id;
          }
        } else {
          $scope.joinContest.team = $scope.teamsAndSingle[0].id;
        }
        $scope.joinContest.password = '';
        $scope.curContest = contest;
        $scope.isCollapsed = false;
      } else {
        $scope.isCollapsed = true;
      }
    };
  }
]);

app.service('JoinContestService', [
  function() {
    var that = this;
    that.update = function(data) {
      that.data = data;
      if (that.callback) that.callback(data);
    }
  }
]);
