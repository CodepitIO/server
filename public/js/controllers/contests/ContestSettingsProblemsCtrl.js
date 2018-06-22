var app = angular.module('Contests');
app.controller('ContestSettingsProblemsController', function ($scope, Languages, ProblemsAPI) {
    $scope.Languages = Languages;
    $scope.searchText = '';
    $scope.selectedProblem = null;
    $scope.totalForbid = 0;
    $scope.contest.languages = _.mapValues(Languages, function() { return 1; } );
    var forbidLang = _.mapValues(Languages, function() { return 0; });

    $scope.checkLang = function(lang, val) {
      return $scope.contest.languages[lang] === val;
    };

    $scope.toggleLang = function(lang) {
      if ($scope.contest.languages[lang] >= 0 && $scope.contest.languages[lang] <= 1) {
        $scope.contest.languages[lang] = 1 - $scope.contest.languages[lang];
      }
    };

    $scope.noLanguagesAvailable = function() {
      return !_.some($scope.contest.languages, function(o) { return o === 1;} );
    };

    $scope.select = function() {
      if ($scope.selectedProblem) {
        $scope.selectedProblem.supportedLangs =
          _.split($scope.selectedProblem.supportedLangs, ',');
        _.forEach(Languages, function (v,k) {
          if (!_.some($scope.selectedProblem.supportedLangs, function(o) { return o === k;} )) {
            forbidLang[k]++;
            $scope.contest.languages[k] = -1;
            if (forbidLang[k] === 1) $scope.totalForbid++;
          }
        });
        $scope.contest.problems.push($scope.selectedProblem);
      }
      $scope.selectedProblem = null;
      $scope.searchText = '';
    };

    $scope.getProblems = function() {
      if ($scope.searchText.length === 0) return [];
      if ($scope.searchText.length > 30) {
        $scope.searchText = $scope.searchText.substring(0, 50);
      }
      var txt = $scope.searchText;
      var problemIds = _.map($scope.contest.problems, '_id');
      return ProblemsAPI.filter($scope.searchText, problemIds).then(function (data) {
        return data.list;
      });
    };

    $scope.removeProblem = function(id) {
      _.remove($scope.contest.problems, function(obj) {
        if (obj._id !== id) {
          return false;
        }
        var plangs = _.split(obj.supportedLangs, ',');
        _.forEach(Languages, function(v,k) {
          if (!_.some(plangs, function(o) { return o === k;} )) {
            forbidLang[k]--;
            if (forbidLang[k] === 0) {
              $scope.contest.languages[k] = 1;
              $scope.totalForbid--;
            }
          }
        });
        return true;
      });
    };

    $scope.sortableOptions = {
      handle: '> .move-handle',
      axis: 'y'
    };
  });
