var app = angular.module('SubmissionCtrl', []);
app.controller('SubmissionController', [
	'$scope',
	'$routeParams',
	'SubmissionFactory',
	function($scope, $routeParams, submission) {
		$scope.code = '';
		var getSubmission = function() {
			submission.get({
				id: $routeParams.id
			}).then(function(data) {
				$scope.code = data.code;
			});
		};
		getSubmission();
	}
]);
