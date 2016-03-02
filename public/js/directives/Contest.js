var app = angular.module('ContestDirective', []);

/*
 * mrtContestListWrapper is the external template that wrappes other templates
 * it is responsable to maintain the proper struct and style of the templates it wrappes
 * The transclude flag allows the directive to include templates inside it and creates a inherited child scope
 * The controller is added here because we need the filter functions on it
 */
app.directive('mrtContestListWrapper', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		templateUrl: 'views/contests/contestListWrapper.html',
		controller: 'ContestsController',
	};
});

app.directive('mrtContestList', function() {
	return {
		restrict: 'E',
		required: 'mrtContestListWrapper',
		scope: {
			withActionCol: '=',
			listFilter: '=',
			emptyMessage: '=',
			adminFlag: '=',
			newFlag: '=',
			subTitle: '=',
			modalId: '=',
		},
		templateUrl: 'views/contests/contestList.html',
		controller: 'ContestsController',
	};
});
