var app = angular.module('CreateContestCtrl', []);
app.controller('CreateContestController', [
	'$scope',
	'$rootScope',
	'$timeout',
	'$location',
	'Notification',
	'ProblemsFactory',
	'ContestsFactory',
	function($scope, $rootScope, $timeout, $location, Notification, problems, contests) {
		$scope.name = '';
		$scope.descr = '';
		$scope.startDateTime = new Date();
		$scope.endDateTime = new Date();
		$scope.password = '';
		$scope.confirmPassword = '';
		$scope.problems = [];
		$scope.contestantType = '3';

		$scope.watchPrivate = 0;
		$scope.access = 'Público';
		$scope.hours = 5;
		$scope.minutes = 0;
		$scope.frozenHours = 1;
		$scope.frozenMinutes = 0;
		$scope.blindHours = 0;
		$scope.blindMinutes = 15;
		$scope.loadingCreate = false;
		$scope.showDescrField = false;
		$scope.opened = false;
		$scope.minDate = new Date();
		$scope.maxDate = new Date();
		$scope.maxDate.setFullYear($scope.maxDate.getFullYear() + 4);
		$scope.startDateTime.setSeconds(0);
		$scope.startDateTime.setMinutes($scope.startDateTime.getMinutes() + 10 - $scope.startDateTime.getMinutes() % 10);
		$scope.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

		$scope.privatePopover = {
			templateUrl: 'private-contest-password.html',
			title: 'Competição Privada'
		};

		$scope.problemRegex = '';
		$scope.fetchedProblems = [];
		var lastTime = 0;

		$scope.fetch = function() {
			var now = Date.now();
			lastTime = now;
			if ($scope.problemRegex.length >= 3) {
				$timeout(function() {
					if (lastTime == now) {
						problems.fetch({
								regex: $scope.problemRegex,
								problems: $scope.problems
							})
							.then(function(data) {
								if (data.error) {
									toastr.error(data.error);
								} else {
									$scope.fetchedProblems = data.problems;
								}
							});
					}
				}, 400);
			} else {
				$scope.fetchedProblems = [];
			}
		};

		$scope.addProblem = function(problem) {
			if ($scope.problems.length >= 26) {
				Notification('A competição pode ter no máximo 26 problemas.');
			} else {
				$scope.problems.push(problem);
				$scope.fetchedProblems = $scope.fetchedProblems.filter(function(obj) {
					return obj.id.toString() != problem.id.toString();
				});
			}
		};

		$scope.removeProblem = function(id) {
			$scope.problems = $scope.problems.filter(function(elem) {
				return elem.id.toString() != id.toString();
			});
		};

		$scope.toggleAccess = function(ev) {
			if ($scope.access == 'Privado') {
				$scope.access = 'Público';
			} else {
				$scope.access = 'Privado';
			}
		};

		$scope.isAccess = function(access) {
			return $scope.access == access;
		};

		$scope.updateBlind = function() {
			$scope.frozenDuration = $scope.frozenHours * 60 + $scope.frozenMinutes;
			$scope.blindHours = $scope.blindHours || 0;
			$scope.blindMinutes = $scope.blindMinutes || 0;
			$scope.blindDuration = Math.min($scope.blindHours * 60 + $scope.blindMinutes, $scope.frozenDuration);
			$scope.blindDuration = Math.max($scope.blindDuration, 0);
			$scope.blindDateTime = new Date($scope.endDateTime);
			$scope.blindDateTime.setMinutes($scope.blindDateTime.getMinutes() - $scope.blindDuration);
			$scope.blindHours = Math.floor($scope.blindDuration / 60);
			$scope.blindMinutes = $scope.blindDuration % 60;
		};

		$scope.updateFrozen = function() {
			$scope.duration = Math.floor($scope.endDateTime - $scope.startDateTime) / 60000;
			$scope.frozenHours = $scope.frozenHours || 0;
			$scope.frozenMinutes = $scope.frozenMinutes || 0;
			$scope.frozenDuration = Math.min($scope.frozenHours * 60 + $scope.frozenMinutes, $scope.duration);
			$scope.frozenDuration = Math.max($scope.frozenDuration, 0);
			$scope.frozenDateTime = new Date($scope.endDateTime);
			$scope.frozenDateTime.setMinutes($scope.frozenDateTime.getMinutes() - $scope.frozenDuration);
			$scope.frozenHours = Math.floor($scope.frozenDuration / 60);
			$scope.frozenMinutes = $scope.frozenDuration % 60;
			$scope.updateBlind();
		};

		$scope.updateEndDateTime = function() {
			$scope.endDateTime = new Date($scope.startDateTime);
			$scope.hours = $scope.hours || 0;
			$scope.minutes = $scope.minutes || 0;
			$scope.duration = Math.max($scope.hours * 60 + $scope.minutes, 0);
			$scope.duration = Math.min($scope.duration, 365 * 24 * 60);
			$scope.endDateTime.setMinutes($scope.endDateTime.getMinutes() + $scope.duration);
			$scope.hours = Math.floor($scope.duration / 60);
			$scope.minutes = $scope.duration % 60;
			$scope.validDuration = ($scope.duration >= 10);
			$scope.updateFrozen();
		};

		$scope.open = function() {
			$timeout(function() {
				$scope.opened = true;
			});
		};

		$scope.create = function() {
			var canCreate = true;
			if ($scope.name.length === 0) {
				Notification('Você deve inserir um nome.');
				canCreate = false;
			}
			if ($scope.name.length > 30) {
				Notification('O nome pode ter no máximo 30 caracteres');
				canCreate = false;
			}
			if ($scope.descr.length > 500) {
				Notification('A descrição pode ter no máximo 500 caracteres');
				canCreate = false;
			}
			if (!$scope.startDateTime || !$scope.endDateTime) {
				Notification('A competição deve ter uma data de início e uma duração.');
				canCreate = false;
			}
			if ($scope.startDateTime < new Date()) {
				Notification('A competição deve ocorrer no futuro.');
				canCreate = false;
			}
			if ($scope.duration < 10) {
				Notification('A competição deve durar ao menos 10 minutos.');
				canCreate = false;
			}
			if ($scope.duration > 365 * 24 * 60) {
				Notification('A competição pode durar no máximo 365 dias.');
				canCreate = false;
			}
			if ($scope.frozenDuration > $scope.duration) {
				Notification('O tempo de Frozen não pode ser maior que a duração da competição.');
				canCreate = false;
			}
			if ($scope.blindDuration > $scope.frozenDuration) {
				Notification('O tempo de Blind não pode ser maior que o tempo de Frozen.');
				canCreate = false;
			}
			if ($scope.problems.length === 0) {
				Notification('Você deve inserir ao menos 1 problema.');
				canCreate = false;
			}
			if ($scope.problems.length > 25) {
				Notification('A competição pode ter no máximo 25 problemas.');
				canCreate = false;
			}
			var password = ($scope.access == 'Privado' && $scope.password) || '';
			var confirmPassword = ($scope.access == 'Privado' && $scope.confirmPassword) || '';
			if (password != confirmPassword) {
				Notification('Você deve confirmar a senha da competição corretamente.');
				canCreate = false;
			}
			if ($scope.access == 'Privado' && password.length === 0 && confirmPassword.length === 0) {
				Notification('Competições privadas devem possuir senha.');
				canCreate = false;
			}
			var contestantType = Number($scope.contestantType);
			if (!contestantType || contestantType < 1 || contestantType > 3) {
				Notification('Opção inválida de tipo de competidor.');
				canCreate = false;
			}

			if (canCreate) {
				$scope.loadingCreate = true;
				contests.create({
						name: $scope.name,
						descr: $scope.descr,
						startDateTime: $scope.startDateTime,
						endDateTime: $scope.endDateTime,
						frozenDateTime: $scope.frozenDateTime,
						blindDateTime: $scope.blindDateTime,
						contestantType: $scope.contestantType,
						password: password,
						confirmPassword: confirmPassword,
						problems: $scope.problems,
						watchPrivate: $scope.watchPrivate
					})
					.then(function(data) {
						Notification.success('Competição criada com sucesso!');
						$scope.loadingCreate = false;
						$location.path('/contests/owned');
					}, function(error) {
						Notification.error(error);
						$scope.loadingCreate = false;
					});
			}
		};
	}
]).directive('gtDate', ['$interval', '$rootScope', function($interval, $rootScope) {
	return {
		require: 'ngModel',
		link: function($scope, $elem, $attrs, ngModel) {
			var validate = function(value) {
				if (!value || value < new Date()) {
					ngModel.$setValidity('gtDate', false);
					return value;
				}
				ngModel.$setValidity('gtDate', true);
				return value;
			};

			var promise = $interval(function() {
				validate(ngModel.$viewValue);
				$scope.updateEndDateTime();
			}, 1000);
			$rootScope.intervalPromises.push(promise);

			$attrs.$observe('gtDate', function(date) {
				$scope.updateEndDateTime();
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
