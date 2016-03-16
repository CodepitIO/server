var app = angular.module('Contests');
app.controller('JoinContestController', [
  '$scope',
  '$mdSidenav',
	'TeamFactory',
  'JoinContestService',
  'ContestInstanceFunctions',
  function($scope, $mdSidenav, team, joinContest, contestFunctions) {
    var SIDENAV_ID = 'join-contest-sidenav';

    $scope.data = {
      role: '',
      password: '',
      team: {}
    };
    $scope.teams = [];

    joinContest.callback = function(contest) {
      $mdSidenav(SIDENAV_ID).toggle();

      $scope.data = {
        role: '',
        password: '',
        team: {}
      };

      $scope.contest = contest;
      if (contest.contestantType === 1) {
        $scope.data.role = 'individual';
      } else if (contest.contestantType === 2) {
        $scope.data.role = 'team';
      }
    }

    $scope.join = function() {
      contestFunctions.join($scope.contest, $scope.data, function(err, ok) {
        if (ok) {
          $scope.contest.isInContest = true;
          $scope.close();
        }
      });
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
      $mdSidenav(SIDENAV_ID).close();
    };
  }
]);

app.service('JoinContestService', [
  function() {
    var that = this;
    this.update = function(data) {
      if (that.callback) {
        that.callback(data);
      }
    }
  }
]);
