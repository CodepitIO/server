mrtApp.directive('loadingSpinner', function(){
  return {
    restrict: 'E',
    scope: {
      color: '=',
      width: '=',
      height: '='
    },
    templateUrl: 'views/misc/loading-spinner.html'
  };
});