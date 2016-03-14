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
			$scope.alignOpts = angular.isDefined($scope.alignOpts) ? $scope.alignOpts : 'center';
			$scope.waitFor = angular.isDefined($scope.waitFor) ? $scope.waitFor : true;
		}]
	};
});


app.filter('mrtTimezoneStrap', function() {
	var regex = /^(Z|[+-])(2[0-3]|[01][0-9]):([0-5][0-9])$/;
	return function(text) {
		if (typeof(text) !== 'string' || text.length === 0) {
			return '';
		}
		var arr = text.match(regex);
		return arr[1] + parseInt(arr[2], 10) + (arr[3] == '00' ? '' : arr[3]);
	};
});

app.directive('mrtDisplayTime', function() {
	return {
		restrict: 'E',
		scope: {
			date: '=',
		},
		template: "<a target=\"_blank\" " +
			"href=\"http://www.timeanddate.com/worldclock/fixedtime.html?day={{date.getUTCDate()}}" +
			"&month={{date.getUTCMonth()+1}}&year={{date.getUTCFullYear()}}&" +
			"hour={{date.getUTCHours()}}&min={{date.getUTCMinutes()}}&sec={{date.getUTCSeconds()}}\">" +
			"<span>{{date | amUtc | amLocal | amDateFormat:'ddd, D/MMM/YYYY, HH:mm'}}</span>" +
			"<sup>UTC{{date | amDateFormat:'Z' | mrtTimezoneStrap}}</sup></a>",
	};
});
