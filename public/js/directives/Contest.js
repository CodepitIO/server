var app = angular.module('ContestDirective', []);

/*
 * mrtContestListWrapper is the external template that wrappes other templates
 * it is responsable to maintain the proper struct and style of the templates it wrappes
 * Set to be use as element-only
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

/*
* mrtContestList is the directive responsable to render a list of contest
* Set to be used as element-only
* has mrtContestListWrapper as required for proper struct of html, but they have no logical dependency
*/
app.directive('mrtContestList', function() {
	return {
		restrict: 'E',
		required: 'mrtContestListWrapper',
		scope: {
			withActionCol: '=', // Show the action column on template (see views/contests/contestList.html)
														// optinal - values = true/false
			listFilter: '=', // Select the filter to apply over the list
												// optional - value = function(value, index, array)
			emptyMessage: '=', // Message to display when list is empty
													// optinal - String
			adminFlag: '=', // Span to indicate the user has admin properties over contest
												// optinal - values = true/false
			newFlag: '=', // Span to indicate that contest is new (based on function declared on controller)
											// optinal - values = true/false
			subTitle: '=', // Table's title
											// optinal - String
			modalId: '=', //Id of the model used on action to join contest
											// required only if action to join contentes is wanted - String`
		},
		templateUrl: 'views/contests/contestList.html',
		controller: 'ContestsController',
	};
});
