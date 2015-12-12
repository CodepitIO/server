var app = angular.module('ClassifierCtrl', []);
app.controller('ClassifierController', [
	'$scope',
	'$routeParams',
	'ClassifierFactory',
	function($scope, $routeParams, classifier) {

		var GOOD_AT_THRESHOLD = 0.75; // 75%

		$scope.knowMostEntries = 5;

		var allTags, general, problems, hasSolved;

		var getMasterTags = function() {
			var tmpLevel = 0;
			for (var i in allTags) {
				if (allTags[i].qnt >= 5) {
					tmpLevel = Math.max(tmpLevel, allTags[i].level);
				}
			}
			return tmpLevel;
		};

		var isGoodAt = function(level, tags) {
			if (tags.length === 0) return false;
			for (var i = 0; i < tags.length; i++) {
				if (allTags[tags[i]] && allTags[tags[i]].level < GOOD_AT_THRESHOLD * level) {
					return false;
				}
			}
			return true;
		};

		$scope.masterTagProblems = [];
		var getMasterTagsProblems = function() {
			var bestLevel = getMasterTags();
			for (var id in problems) if (!hasSolved[id] && isGoodAt(bestLevel, problems[id].tags)) {
				$scope.masterTagProblems.push(problems[id]);
			}
		};

		var getData = function() {
			classifier.get({
				handle: $routeParams.handle
			}).then(function(data) {
				allTags = data.allTags;
				general = data.general;
				hasSolved = data.hasSolved;
				problems = data.problems;
				getMasterTagsProblems();
			}, function(err) {
				console.log('Error:', err);
			});
		};
		getData();

	}
])
.filter('beautifyTags', function() {
  return function(input) {
    return input.join(", ");
  };
});
