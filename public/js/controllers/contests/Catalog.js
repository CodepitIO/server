var app = angular.module('Contests');
app.controller('CatalogController', [
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'$interval',
	'$location',
	'Notification',
	'CatalogFactory',
	'TagFactory',
	'SubmissionFactory',
	'ContestInstanceAPI',
	'ContestInstanceFunctions',
	function($scope, $rootScope, $state, $stateParams, $interval, $location, Notification, catalog, tag, submission, contestAPI, contestFunctions) {
		var getTags = function() {
			tag.getTags().then(function(data) {
				$scope.allTags = data.tags;
			});
		};
		getTags();

		var dta = [
			['á', 'à', 'ã', 'â', 'ä'],
			['é', 'è', 'ê', 'ë'],
			['í', 'ì', 'î', 'ï'],
			['õ', 'ô', 'ó', 'ò', 'ö'],
			['ü', 'ù', 'ú', 'û']
		];
		var dtv = ['a', 'e', 'i', 'o', 'u'];
		$scope.fixTagInput = function(prob) {
			var val = prob.tagSelected.toLowerCase();
			val = val.replace('ç', 'c');
			val = val.replace('Ç', 'c');
			for (var i = 0; i < 5; i++) {
				for (var j = 0; j < dta[i].length; j++) {
					val = val.replace(dta[i][j], dtv[i]);
					var upper = String.fromCharCode(dta[i][j].charCodeAt(0) - 0x20);
					val = val.replace(upper, dtv[i]);
				}
			}
			$scope.curProblem = Number(prob.num);
			prob.tagSelected = val;
		};

		var updateCatalog = function(p) {
			catalog.update({
				keys: {
					contestant: $scope.contestantId,
					contest: $scope.id
				},
				data: {
					rate: p.rate,
					tags: p.tags,
					problem: p.id
				}
			});
		};

		var getCatalog = function() {
			catalog.get({
				keys: {
					contestant: $scope.contestantId,
					contest: $scope.id
				}
			}).then(function(ret) {
				for (var p in ret.data) {
					$scope.problems[p].rate = ret.data[p].rate;
					$scope.problems[p].tags = ret.data[p].tags;
				}
			});
		};

		$scope.onSelectTag = function($item, $model, $label, p) {
			if (!p.tags) {
				p.tags = {};
			}
			p.tags[$item.id] = $item;
			p.tagSelected = null;
			updateCatalog(p);
		};

		$scope.notInsertedTags = function(p) {
			var ins = p.tags || {};
			return function(t) {
				return !ins[t.id];
			};
		};

		$scope.insertTag = function(ev, p) {
			if (ev.keyCode === 13 && p.tagSelected && p.tagSelected.length > 0) {
				tag.create({
					name: p.tagSelected
				}).then(function(data) {
					$scope.allTags.push(data);
					p.tags = p.tags || {};
					p.tags[data.id] = data;
					updateCatalog(p);
				}, function(err) {
					Notification.error(err);
				});
				p.tagSelected = null;
			}
		};

		$scope.removeTag = function(tag, p) {
			delete p.tags[tag.id];
			updateCatalog(p);
		};

		$scope.selectRate = function(p) {
			updateCatalog(p);
		};

		$scope.ratingStates = [{
			stateOn: 'fa fa-star fa-2x',
			stateOff: 'fa fa-star-o fa-2x'
		}, {
			stateOn: 'fa fa-star fa-2x',
			stateOff: 'fa fa-star-o fa-2x'
		}, {
			stateOn: 'fa fa-star fa-2x',
			stateOff: 'fa fa-star-o fa-2x'
		}, {
			stateOn: 'fa fa-star fa-2x',
			stateOff: 'fa fa-star-o fa-2x'
		}, {
			stateOn: 'fa fa-star fa-2x',
			stateOff: 'fa fa-star-o fa-2x'
		}, ];
	}
]);
