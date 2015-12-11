var app = angular.module('ClassifierCtrl', []);
app.controller('ClassifierController', [
  '$scope',
	'$routeParams',
  'ClassifierFactory',
	function($scope, $routeParams, classifier) {

    $scope.bestTags = {};

    var getMasterTags = function() {
      var tags = [];
      var tmpLevel = -1;
      for (var i in $scope.allTags) {
        if ($scope.allTags[i].qnt >= 5 && tags.length < 6 &&
          (tmpLevel == -1 || $scope.allTags[i].level >= 0.75 * tmpLevel)) {
          if (tmpLevel == -1) tmpLevel = $scope.allTags[i].level;
          tags.push({
            tag: i,
            level: $scope.allTags[i].level,
          });
        }
      }
      tags.sort(function(a,b) {
        return b.level-a.level;
      });
      for (i = 0; i < tags.length; i++) {
        $scope.bestTags[tags[i].tag] = tags[i].level;
      }
    };

		var getData = function() {
			classifier.get({
				handle: $routeParams.handle
			}).then(function(data) {
        $scope.allTags = data.allTags;
        $scope.general = data.general;
        $scope.hasSolved = data.hasSolved;
        $scope.problems = data.problems;
        getMasterTags();
			}, function(err) {
        console.log('Error:', err);
      });
		};
		getData();

	}
]);
