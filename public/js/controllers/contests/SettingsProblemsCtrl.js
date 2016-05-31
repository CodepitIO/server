var app = angular.module('Contests')
app.controller('SettingsProblemsController', [
  '$scope',
  'ProblemsFacade',
  function ($scope, problems) {
    $scope.problems = []
    $scope.searchText = ''
    $scope.selectedProblem = null

    $scope.select = function() {
      if ($scope.selectedProblem) {
        $scope.problems.push($scope.selectedProblem)
      }
      $scope.searchText = ''
      $scope.selectedProblem = null
    }

    $scope.getProblems = function() {
      if ($scope.searchText.length === 0) return []
      var txt = $scope.searchText
      return problems.filter($scope.searchText).then(function (data) {
        return data.list
      })
    }
  }
])
