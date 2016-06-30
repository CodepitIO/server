var app = angular.module('Problems')
app.controller('ProblemController', [
  '$scope',
  '$state',
  '$sce',
  '$window',
  'OJName',
  'problem',
  function ($scope, $state, $sce, $window, OJName, problem) {
    if ($state.is('problems')) $state.go('.view')
    $scope.problem = problem
    $scope.problem.oj = OJName[problem.oj]
    if (problem.source) $scope.problem.source = $sce.trustAsHtml(problem.source)
    if (!problem.imported) $window.open(problem.originalUrl || problem.url)
  }
])
