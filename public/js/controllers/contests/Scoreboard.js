var app = angular.module('Contests');
app.controller('ScoreboardController', [
	'$scope',
	function($scope) {
		/*
		$scope.loadingData = true;
		$scope.pendingSubmissions = {};

    $scope.toggleUpsolving = function() {
      var tmp = $scope.ord;
      $scope.ord = $scope.ord2;
      $scope.ord2 = tmp;

      tmp = $scope.scores;
      $scope.scores = $scope.scores2;
      $scope.scores2 = tmp;

      tmp = $scope.submissions;
      $scope.submissions = $scope.submissions2;
      $scope.submissions2 = tmp;

      if (!$scope.$$phase) {
        $scope.$digest();
      }
    };

    /*var getDynamicScoreboard = function() {
			contestAPI.getDynamicScoreboard({
					id: $scope.id
				})
				.then(function(data) {
					$scope.allSubmissions = data.submissions;
				});
		};*/

		/*$scope.refreshScoreboard = function() {
			if ($scope.allSubmissions && $scope.timeLeft === 0 && $scope.timeline.moment <= $scope.timeline.options.max) {
				$scope.scores = contestFunctions.getScoreMap($scope.allSubmissions, $scope.timeline.moment);
				$scope.ord = contestFunctions.getLeadershipOrder($scope.contestants, $scope.problems, $scope.scores);
				if (!$scope.$$phase) {
					$scope.$digest();
				}
			}
		};*/

		/*var lastSlide = 0;
		$scope.timeAndRefreshScoreboard = function() {
			var now = new Date();
			// 100 ms to change scoreboard
			if (now - lastSlide > 100 || $scope.timeline.moment === 0 || $scope.timeline.moment == $scope.timeline.options.max) {
				$scope.refreshScoreboard();
				lastSlide = now;
			}
		};*/

		/*var getVerdictFunction = function(verdict) {
			if (!verdict || verdict < 0 || verdict > 10) {
				return 'info';
			}
			if (verdict == 1) {
				return 'success';
			} else if (verdict == 2) {
				return 'error';
			} else if (verdict == 8) {
				return 'warning';
			}
			return 'info';
		};

		var updateScoreboard = function() {
			contestAPI.getScoreboard({
				id: $scope.id
			}).then(function(data) {
				$scope.scores = data.scores;
				$scope.contestants = data.contestants;
				$scope.submissions = data.submissions;

				for (var i = 0; i < $scope.submissions.length; i++) {
					var id = $scope.submissions[i]._id;
					var verdict = $scope.submissions[i].verdict;
					if ($scope.pendingSubmissions[id] && verdict >= 1 && verdict <= 10) {
						var msg = "Problema " + $scope.problems[$scope.submissions[i].problem].letter + ": " + $scope.verdictName[verdict];
						Notification[getVerdictFunction(verdict)]({
							message: msg,
							delay: 20000
						});
						delete $scope.pendingSubmissions[id];
					} else if (!$scope.pendingSubmissions[id] && (verdict < 1 || verdict > 10)) {
						$scope.pendingSubmissions[id] = true;
					}
				}
				$scope.ord = contestFunctions.getLeadershipOrder($scope.contestants, $scope.problems, $scope.scores);
				if (!$scope.$$phase) {
					$scope.$digest();
				}
			}, function(err) {
				Notification.error('Você precisa estar registrado nessa competição para visualizá-la');
				$location.path('/contests/open');
			});
		};*/

		/*

		$scope.getPenalty = function(B, A) {
			if ($scope.scores[A] && $scope.scores[A][B] && $scope.scores[A][B].status == 1) {
				return $scope.scores[A][B].time + " (" + $scope.scores[A][B].errorCount + ")";
			} else {
				if ($scope.scores[A] && $scope.scores[A][B] && $scope.scores[A][B].errorCount > 0) {
					return "(" + $scope.scores[A][B].errorCount + ")";
				}
				return "";
			}
		};

		$scope.getScoreClass = function(B, A) {
			if ($scope.scores[A] && $scope.scores[A][B] && $scope.scores[A][B].status == 1) {
				return 'green-score';
			} else {
				var rclass = '';
				if ($scope.scores[A] && $scope.scores[A][B]) {
					if ($scope.scores[A][B].errorCount > 0) {
						rclass += 'red-score';
					} else {
						rclass += 'gray-score';
					}
					if ($scope.scores[A][B].status === 0) {
						rclass += ' smooth_blink';
					}
				}
				return rclass;
			}
		};

		$scope.getSubmissionClass = function(verdict) {
			if (verdict > 10) {
				return 'draft-submission';
			}
			if (!verdict || verdict < 0 || verdict > 10) {
				return 'pending-submission';
			}
			if (verdict == 1) {
				return 'accepted-submission';
			} else if (verdict == 2) {
				return 'wa-submission';
			} else if (verdict == 8) {
				return 'pe-submission';
			}
			return 'error-submission';
		};

    getScoreboard();*/
	}
]);
