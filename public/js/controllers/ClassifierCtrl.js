var app = angular.module('ClassifierCtrl', []);
app.controller('ClassifierController', [
		'$scope',
		'$routeParams',
		'ClassifierFactory',
		function($scope, $routeParams, classifier) {
			var GOOD_AT_THRESHOLD = 0.8; // 75%

			$scope.statesWithFlags = [{
				'name': 'Alabama',
				'flag': '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'
			}, {
				'name': 'Alaska',
				'flag': 'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'
			}, {
				'name': 'Arizona',
				'flag': '9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'
			}, {
				'name': 'Arkansas',
				'flag': '9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'
			}, {
				'name': 'California',
				'flag': '0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'
			}, {
				'name': 'Colorado',
				'flag': '4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'
			}, {
				'name': 'Connecticut',
				'flag': '9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'
			}, {
				'name': 'Delaware',
				'flag': 'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'
			}, {
				'name': 'Florida',
				'flag': 'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'
			}, {
				'name': 'Georgia',
				'flag': '5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'
			}, {
				'name': 'Hawaii',
				'flag': 'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'
			}, {
				'name': 'Idaho',
				'flag': 'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'
			}, {
				'name': 'Illinois',
				'flag': '0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'
			}, {
				'name': 'Indiana',
				'flag': 'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'
			}, {
				'name': 'Iowa',
				'flag': 'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'
			}, {
				'name': 'Kansas',
				'flag': 'd/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'
			}, {
				'name': 'Kentucky',
				'flag': '8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'
			}, {
				'name': 'Louisiana',
				'flag': 'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'
			}, {
				'name': 'Maine',
				'flag': '3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'
			}, {
				'name': 'Maryland',
				'flag': 'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'
			}, {
				'name': 'Massachusetts',
				'flag': 'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'
			}, {
				'name': 'Michigan',
				'flag': 'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'
			}, {
				'name': 'Minnesota',
				'flag': 'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'
			}, {
				'name': 'Mississippi',
				'flag': '4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'
			}, {
				'name': 'Missouri',
				'flag': '5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'
			}, {
				'name': 'Montana',
				'flag': 'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'
			}, {
				'name': 'Nebraska',
				'flag': '4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'
			}, {
				'name': 'Nevada',
				'flag': 'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'
			}, {
				'name': 'New Hampshire',
				'flag': '2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'
			}, {
				'name': 'New Jersey',
				'flag': '9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'
			}, {
				'name': 'New Mexico',
				'flag': 'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'
			}, {
				'name': 'New York',
				'flag': '1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'
			}, {
				'name': 'North Carolina',
				'flag': 'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'
			}, {
				'name': 'North Dakota',
				'flag': 'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'
			}, {
				'name': 'Ohio',
				'flag': '4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'
			}, {
				'name': 'Oklahoma',
				'flag': '6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'
			}, {
				'name': 'Oregon',
				'flag': 'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'
			}, {
				'name': 'Pennsylvania',
				'flag': 'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'
			}, {
				'name': 'Rhode Island',
				'flag': 'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'
			}, {
				'name': 'South Carolina',
				'flag': '6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'
			}, {
				'name': 'South Dakota',
				'flag': '1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'
			}, {
				'name': 'Tennessee',
				'flag': '9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png'
			}, {
				'name': 'Texas',
				'flag': 'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'
			}, {
				'name': 'Utah',
				'flag': 'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png'
			}, {
				'name': 'Vermont',
				'flag': '4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png'
			}, {
				'name': 'Virginia',
				'flag': '4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png'
			}, {
				'name': 'Washington',
				'flag': '5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png'
			}, {
				'name': 'West Virginia',
				'flag': '2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png'
			}, {
				'name': 'Wisconsin',
				'flag': '2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png'
			}, {
				'name': 'Wyoming',
				'flag': 'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'
			}];

			$scope.tags = ["brute force", "combinatorics", "implementation", "constructive algorithms", "dp", "greedy", "hashing", "string suffix structures", "strings", "binary search", "number theory", "data structures", "dfs and similar", "shortest paths", "trees", "math", "graphs", "matrices", "divide and conquer", "sortings", "bitmasks", "two pointers", "chinese remainder theorem", "geometry", "expression parsing", "probabilities", "2-sat", "dsu", "graph matchings", "games", "flows", "fft", "meet-in-the-middle", "ternary search", "schedules"];
			$scope.tags.sort();
			$scope.loading = true;

			$scope.sel1 = {
				r1: false,
				r2: true,
				r3: true,
				r4: true,
				r5: false
			};
			$scope.sel2 = {
				r1: false,
				r2: true,
				r3: true,
				r4: true,
				r5: false
			};

			$scope.knowMostEntries = 5;
			$scope.knowMostEntries2 = 5;
			$scope.knowMostEntries3 = 5;

			$scope.masterTagProblems = [];
			$scope.taggedProblems = [];
			$scope.problemSelected = null;

			var allTags, general, problems, hasSolved;

			function tmpTrim(num) {
				return Math.round(num * 100) / 100;
			}

			$scope.similarProblems = [];
			$scope.changeProblem = function(problem) {
				$scope.similarProblems = [];
				var selProblemTags = {};
				for (var i = 0; i < problem.tags.length; i++) {
					selProblemTags[problem.tags[i]] = true;
				}
				for (var j = 0; j < $scope.allProblems.length; j++) {
					var cprob = $scope.allProblems[j];
					var can = true;
					for (i = 0; i < cprob.tags.length; i++) {
						if (!selProblemTags[cprob.tags[i]]) {
							can = false;
							break;
						}
					}
					if (can && cprob.tags.length >= problem.tags.length * 0.5 &&
						Math.abs(problem.level - cprob.level) <= 1.5 && problem._id !== cprob._id) {
						$scope.similarProblems.push(cprob);
					}
				}
			};

			$scope.isCoolLevel1 = function(problem) {
				var level = $scope.getProblemLevel(problem) + 3;
				return $scope.sel1['r' + level];
			};

			$scope.isCoolLevel2 = function(problem) {
				var level = $scope.getProblemLevel(problem) + 3;
				return $scope.sel2['r' + level];
			};

			$scope.getProblemLevel = function(problem) {
				if (!problem || !problem.level) return -10;
				var dif = Math.floor(Math.abs(problem.level - general.level) / 1.5);
				if (dif > 0 && problem.level < general.level) dif = -dif;
				return dif;
			};

			$scope.getProblemLevelClass = function(problem) {
				if (!problem || !problem.level) return '';
				var dif = Math.floor(Math.abs(problem.level - general.level) / 1.5);
				if (dif > 0 && problem.level < general.level) dif = -dif;
				var input = dif;
				if (input <= -2) return 'label-very-easy';
				else if (input <= -1) return 'label-success';
				else if (input < 1) return 'label-warning';
				else if (input >= 2) return 'label-very-danger';
				return 'label-danger';
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
				for (var id in problems)
					if (!hasSolved[id] && isGoodAt(bestLevel, problems[id].tags)) {
						$scope.masterTagProblems.push(problems[id]);
					}
			};

			$scope.allProblems = [];
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
					for (id in problems) {
						$scope.allProblems.push(problems[id]);
					}
					$scope.loading = false;
				}, function(err) {
					console.log('Error:', err);
				});
			};
			getData();

		}
	])
	.filter('beautifyTags', function() {
		return function(input) {
			input = input || [];
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
			if (input <= -10) return '';
			if (input <= -2) return 'label-very-easy';
			else if (input <= -1) return 'label-success';
			else if (input < 1) return 'label-warning';
			else if (input >= 2) return 'label-very-danger';
			return 'label-danger';
		};
	});
