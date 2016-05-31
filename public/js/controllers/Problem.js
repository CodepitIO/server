var app = angular.module('Problems')
app.controller('ProblemController', [
  '$scope',
  '$stateParams',
  '$sce',
  '$window',
  'ProblemsFacade',
  'OJName',
  function ($scope, $stateParams, $sce, $window, Problems, OJName) {
    $scope.problem = {}
    $scope.loadingData = true
    Problems.get($stateParams.id, function (err, data) {
      data.oj = OJName[data.oj]
      $scope.problem = data
      $scope.loadingData = false
      if (data.source) {
        $scope.problem.source = $sce.trustAsHtml(data.source)
      }
      if (!data.imported && !data.isPdf) {
        $window.open(data.originalUrl || data.url)
      }
    })
  }
])