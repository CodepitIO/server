var app = angular.module('ContestDirective', []);

app.directive('mrtContestListWrapper', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: false,
		templateUrl: 'views/contests/contestListWrapper.html',
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
