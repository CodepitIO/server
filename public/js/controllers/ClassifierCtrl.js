var app = angular.module('ClassifierCtrl', []);
app.controller('ClassifierController', [
	'$scope',
	'$routeParams',
	'ClassifierFactory',
	function($scope, $routeParams, classifier) {
		var GOOD_AT_THRESHOLD = 0.8; // 75%

		$scope.tags = ["brute force", "combinatorics", "implementation", "constructive algorithms", "dp", "greedy", "hashing", "string suffix structures", "strings", "binary search", "number theory", "data structures", "dfs and similar", "shortest paths", "trees", "math", "graphs", "matrices", "divide and conquer", "sortings", "bitmasks", "two pointers", "chinese remainder theorem", "geometry", "expression parsing", "probabilities", "2-sat", "dsu", "graph matchings", "games", "flows", "fft", "meet-in-the-middle", "ternary search", "schedules"];

		$scope.knowMostEntries = 5;
		$scope.knowMostEntries2 = 5;
		$scope.masterTagProblems = [];
		$scope.taggedProblems = [];

		var allTags, general, problems, hasSolved;

		function tmpTrim(num) {
			return Math.round(num * 100) / 100;
		}

		$scope.getProblemLevel = function(problem) {
			var dif = Math.floor(Math.abs(problem.level - general.level) / 1.5);
			if (dif > 0 && problem.level < general.level) dif = -dif;
			return dif;
		};

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
				if (!allTags[tags[i]] || allTags[tags[i]].level < GOOD_AT_THRESHOLD * level) {
					return false;
				}
			}
			return true;
		};

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
				for (var id in problems) {
					$scope.taggedProblems.push(problems[id]);
				}
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
})
.filter('problemLevel', function() {
  return function(input) {
		if (input <= -2) return 'Very Easy';
		else if (input <= -1) return 'Easy';
		else if (input < 1) return 'Medium';
		else if (input >= 2) return 'Very Hard';
		return 'Hard';
  };
})
.filter('problemLevelClass', function() {
  return function(input) {
		if (input <= -2) return 'label-very-easy';
		else if (input <= -1) return 'label-success';
		else if (input < 1) return 'label-warning';
		else if (input >= 2) return 'label-very-danger';
		return 'label-danger';
  };
});
