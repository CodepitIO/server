var app = angular.module("Problems");
app.controller(
  "ProblemController",
  function (
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $sce,
    $window,
    OJName,
    problem
  ) {
    if ($state.is("problems")) return $state.go(".view");
    $rootScope.title = "";
    problem.printName = problem.name;
    if ($stateParams.index) {
      var letter = String.fromCharCode(65 + parseInt($stateParams.index));
      problem.name = "(" + letter + ") " + problem.name;
      problem.printName = letter + ". " + problem.printName;
    }
    $rootScope.title +=
      problem.name + " - " + OJName[problem.oj] + " - Codepit";
    $scope.problem = problem;
    $scope.problem.oj = OJName[problem.oj];
    if (problem.source)
      $scope.problem.source = $sce.trustAsHtml(problem.source);
    if (!problem.imported) $window.open(problem.originalUrl || problem.url);

    $scope.print = function () {
      $window.print();
    };
    $scope.openPage = function (problem) {
      window.location = problem;
    };
  }
);
