var app = angular.module('Contests');
app.controller('ContestsController', [
	'$scope',
	'$rootScope',
	'$location',
	'Notification',
	'ContestsFactory',
	'ContestInstanceAPI',
	'ContestInstanceFunctions',
	'TimeFactory',
	'JoinContestService',
	'$mdSidenav',
	function($scope, $rootScope, $location, Notification, contests, contestInstance, contestFunctions, time, joinContest, $mdSidenav) {
		$scope.loadingData = true;

		$scope.contests = [];

		$scope.filterType = $scope.filterType || $location.path().split('/')[2] || 'open';

		if ($scope.filterType == 'now' || $scope.filterType == 'future') {
			$scope.predicate = 'date_start';
			$scope.reverse = false;
		} else if ($scope.filterType == 'owned') {
			$scope.predicate = 'date_start';
			$scope.reverse = true;
		} else {
			$scope.predicate = 'date_end';
			$scope.reverse = true;
		}

		var fetchData = function() {
			contestPromise = contests.getByFilter({
				filter: $scope.filterType
			});

			contestPromise.then(function(data) {
				$scope.loadingData = false;
				$scope.contests = data.contests;
				for (var i = 0; i < $scope.contests.length; i++) {
					var start = $scope.contests[i].date_start = new Date($scope.contests[i].date_start);
					var end = $scope.contests[i].date_end = new Date($scope.contests[i].date_end);
					$scope.contests[i].duration = Math.floor((end - start) / 1000);
				}
			});
		};
		fetchData();

		$scope.order = function(predicate) {
			$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
			$scope.predicate = predicate;
		};

		$scope.isInFuture = function(date) {
			return new Date(date) > time.server.static;
		};

		$scope.isNewContest = function(date) {
			return ((time.server.static - new Date(date)) / 60000) <= 10;
		};

		$scope.isOldDate = function(date) {
			return new Date(date) <= time.server.static;
		};

		$scope.toggleRight = function(contest) {
			joinContest.update(contest);
			$mdSidenav('right').toggle();
		}
		$scope.isOpenRight = function() {
			return $mdSidenav('right').isOpen();
		};
	}
]);
