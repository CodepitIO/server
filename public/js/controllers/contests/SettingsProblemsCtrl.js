var app = angular.module('Contests')
app.controller('SettingsProblemsController', [
  '$scope',
  'ProblemsFacade',
  'SettingsState',
  function ($scope, problems, settingsState) {
    var problemIds = []
    $scope.problems = []
    $scope.searchText = ''
    $scope.selectedProblem = null
    $scope.settingsState = settingsState

    $scope.select = function() {
      if ($scope.selectedProblem) {
        $scope.problems.push($scope.selectedProblem)
        problemIds.push($scope.selectedProblem._id)
      }
      $scope.selectedProblem = null
      $scope.searchText = ''
    }

    $scope.getProblems = function() {
      if ($scope.searchText.length === 0) return []
      if ($scope.searchText.length > 30) {
        $scope.searchText = $scope.searchText.substring(0, 50)
      }
      var txt = $scope.searchText
      return problems.filter($scope.searchText, problemIds).then(function (data) {
        return data.list
      })
    }

    $scope.removeProblem = function(id) {
      _.remove($scope.problems, function(obj) {
        return obj._id === id
      })
      _.pull(problemIds, id)
    }

    $scope.sortableOptions = {
      handle: '> .move-handle',
      axis: 'y'
    }
  }
])
