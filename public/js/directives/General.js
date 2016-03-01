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
		},
		templateUrl: 'views/breadcrumbs.html',
	};
});
