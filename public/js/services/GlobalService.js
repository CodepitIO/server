var app = angular.module('GlobalService', [])
	.factory('GlobalFactory', [
		'$q',
		function($q) {
			return {
				post: function(API, params) {
					var deferred = $q.defer();
					API.save(params, function(result) {
						if (result.error) {
							deferred.reject(result.error);
						} else {
							deferred.resolve(result);
						}
					});
					return deferred.promise;
				},
				get: function(API, params) {
					var deferred = $q.defer();
					API.get(params, function(result) {
						if (result.error) {
							deferred.reject(result.error);
						} else {
							deferred.resolve(result);
						}
					});
					return deferred.promise;
				}
			};
		}
	])
	.value('GlobalFlags', {
		'createContest': 1
	})
	.directive('tooltip', function() {
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
	})
	.directive('matchField', [function() {
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
