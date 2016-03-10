var app = angular.module('GeneralDirective', []);

app.directive('confirmedClick', [function() {
	return {
		link: function(scope, element, attr) {
			var msg = attr.ngConfirmClick || 'Você tem certeza?';
			var clickAction = attr.confirmedClick;
			element.bind('click', function(event) {
				if (window.confirm(msg)) {
					scope.$eval(clickAction);
				}
			});
		}
	};
}]);

app.directive('mrtBreadcrumbs', function() {
	return {
		restrict: 'E',
		scope: {
			title: '=',
			location: '=',
		},
		templateUrl: 'views/breadcrumbs.html',
	};
});

app.directive('matchField', [function() {
	return {
		require: 'ngModel',
		link: function($scope, $elem, $attrs, ngModel) {
			var validate = function(value) {
				var comparisonModel = $attrs.matchField;
				if (comparisonModel != value) {
					ngModel.$setValidity('matchField', false);
					return value;
				}
				ngModel.$setValidity('matchField', true);
				return value;
			};

			$attrs.$observe('matchField', function(comparisonModel) {
				return validate(ngModel.$viewValue);
			});

			ngModel.$parsers.unshift(function(value) {
				return validate(value);
			});
			ngModel.$formatters.unshift(function(value) {
				return validate(value);
			});
		}
	};
}]);

app.directive('tooltip', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$(element).hover(function() {
				// on mouseenter
				$(element).tooltip('show');
			}, function() {
				// on mouseleave
				$(element).tooltip('hide');
			});
		}
	};
});

app.directive('loadingSpinner', function() {
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

app.directive('mrtPageWrapper', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			waitFor: '=?',
			color: '=?',
			width: '=?',
			height: '=?',
			alignOpts: '=?'
		},
		templateUrl: 'views/misc/page-wrapper.html',
    controller: ['$scope', function($scope) {
      $scope.color = angular.isDefined($scope.color) ? $scope.color : '#45a7b9';
      $scope.height = angular.isDefined($scope.height) ? $scope.height : '200px';
      $scope.width = angular.isDefined($scope.width) ? $scope.width : '200px';
      $scope.alignOpts = angular.isDefined($scope.alignOpts) ? $scope.alignOpts : 'left';
      $scope.waitFor = angular.isDefined($scope.waitFor) ? $scope.waitFor : true;
    }]
	};
});
