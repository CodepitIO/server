var app = angular.module('ProblemsCtrl', []);
app.controller('ProblemsController', [
	'$scope',
	'$timeout',
	'Notification',
	'ProblemsFactory',
	function($scope, $timeout, Notification, problems) {

		$scope.regex = '';
		$scope.problems = [];
		var lastTime = 0;

		$scope.fetch = function() {
			var now = Date.now();
			lastTime = now;
			if ($scope.regex.length >= 3) {
				$timeout(function() {
					if (lastTime == now) {
						problems.fetch({
								regex: $scope.regex
							})
							.then(function(data) {
								if (data.error) {
									Notification.error(data.error);
								} else {
									$scope.problems = data.problems;
								}
							});
					}
				}, 200);
			} else {
				$scope.problems = [];
			}
		};

	}
]);
