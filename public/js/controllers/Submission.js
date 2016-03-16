var app = angular.module('Submission');
app.controller('SubmissionController', [
	'$scope',
	'$stateParams',
	'SubmissionFactory',
	function($scope, $stateParams, submission) {
		$scope.code = '';
		var getSubmission = function() {
			submission.get({
				id: $stateParams.id
			}).then(function(data) {
				$scope.code = data.code;
			});
		};
		getSubmission();
	}
]);
