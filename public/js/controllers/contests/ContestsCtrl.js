var app = angular.module('ContestsCtrl', []);
app.controller('ContestsController', [
	'$scope',
	'$rootScope',
	'$location',
	'Notification',
	'SingleContestFactory',
	'ContestsFactory',
	'SingleContestFactory',
	'TeamFactory',
	function($scope, $rootScope, $location, Notification, singleContest, contests, singleContest, team) {
		var dummySingle = {
			id: '0',
			name: '(individualmente)'
		};
		$scope.contests = [];
		$scope.teams = [];
		$scope.teamsAndSingle = [];
		$scope.serverTime = undefined;

		$scope.joinContest = {
			password: '',
			team: {}
		};
		$scope.curContest = {};
		$scope.isCollapsed = true;

		$scope.loadingData = true;

		$scope.filterType = $location.path().split('/')[2] || 'open';

		if ($scope.filterType == 'open') {
			$scope.predicate = 'date_start';
			$scope.reverse = false;
		} else if ($scope.filterType == 'owned') {
			$scope.predicate = 'date_start';
			$scope.reverse = true;
		} else {
			$scope.predicate = 'date_end';
			$scope.reverse = true;
		}

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

		var fetchData = function() {
			contestPromise = contests.getByFilter({
				filter: $scope.filterType
			});

			contestPromise.then(function(data) {
				$scope.loadingData = false;
				$scope.contests = data.contests;
				$scope.serverTime = data.serverTime;
				for (var i = 0; i < $scope.contests.length; i++) {
					var start = $scope.contests[i].date_start;
					var end = $scope.contests[i].date_end;
					$scope.contests[i].duration = Math.floor((new Date(end) - new Date(start)) / 1000);
				}
			});

			team.getFromUser({})
				.then(function(data) {
					$scope.teams = data.teams.map(function(obj) {
						return {
							id: obj._id,
							name: obj.name
						};
					});
					$scope.teamsAndSingle = [dummySingle].concat($scope.teams);
				});
		};
		fetchData();

		$scope.futureContestFilter = function(value, index, array) {
			return new Date(value.date_start) > new Date($scope.serverTime);
		};

		$scope.happeningContestFilter = function(value, index, array) {
			return new Date(value.date_start) <= new Date($scope.serverTime);
		};

		$scope.order = function(predicate) {
			$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
			$scope.predicate = predicate;
		};

		$scope.isInFuture = function(date) {
			return new Date(date) > new Date($scope.serverTime);
		};

		$scope.isNewContest = function(date) {
			return (((new Date($scope.serverTime)) - (new Date(date))) / 60000) <= 10;
		};

		$scope.isOldDate = function(date) {
			return (new Date(date)) <= (new Date($scope.serverTime));
		};

		$scope.remove = function(id) {
			singleContest.remove({
					id: id
				})
				.then(function(data) {
					Notification('Competição removida.');
					$scope.contests = $scope.contests.filter(function(obj) {
						return obj._id.toString() != id.toString();
					});
				});
		};

		$scope.join = function() {
			singleContest.join({
				id: $scope.curContest._id,
				password: $scope.joinContest.password,
				team: $scope.joinContest.team
			}).then(function(data) {
				Notification.success('Inscrito com sucesso nessa competição!');
				$scope.curContest.isInContest = true;
				$scope.isCollapsed = true;
			}, function(err) {
				Notification.error(err);
			});
		};

		$scope.leave = function(contest) {
			singleContest.leave({
				id: contest._id,
			}).then(function(data) {
				Notification('Você saiu da competição.');
				contest.isInContest = false;
			}, function(err) {
				Notification.error(err);
			});
		};
	}
]);
