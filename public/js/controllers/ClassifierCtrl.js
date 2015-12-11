var app = angular.module('ClassifierCtrl', []);
app.controller('ClassifierController', [
  '$scope',
	'$routeParams',
  'ClassifierFactory',
	function($scope, $routeParams, classifier) {
		var getData = function() {
			classifier.get({
				handle: $routeParams.handle
			}).then(function(data) {
        console.log(data);
			}, function(err) {
        console.log('Error:', err);
      });
		};
		getData();
	}
]);
