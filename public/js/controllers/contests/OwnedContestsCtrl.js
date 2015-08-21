var app = angular.module('OwnedContestsCtrl', []);
app.controller('OwnedContestsController', [
	'$scope',
	'$rootScope',
	'Notification',
	'ContestsFactory',
	'SingleContestFactory',
	function($scope, $rootScope, Notification, contests, singleContest) {

		$scope.predicate = 'date_created';
		$scope.reverse = true;

		$scope.contests = [];

		var fetchContests = function() {
			contests.getAllFromLoggedUser({})
				.then(function(data) {
					$scope.contests = data.contests;
					for (var i = 0; i < $scope.contests.length; i++) {
						var start = $scope.contests[i].date_start;
						var end = $scope.contests[i].date_end;
						$scope.contests[i].duration = Math.floor((new Date(end) - new Date(start)) / 1000);
					}
				});
		};
		fetchContests();

		$scope.order = function(predicate) {
			$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
			$scope.predicate = predicate;
		};

		$scope.isNewContest = function(date) {
			return (((new Date()) - (new Date(date))) / 60000) <= 10;
		};

		$scope.isOldDate = function(date) {
			return (new Date(date)) <= (new Date());
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
	}
]);
