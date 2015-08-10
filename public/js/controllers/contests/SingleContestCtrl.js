var app = angular.module('SingleContestCtrl', []);
app.controller('SingleContestController', [
	'$scope',
	'$rootScope',
	'$routeParams',
	'$interval',
	'$location',
	'Notification',
	'CatalogFactory',
	'TagFactory',
	'SubmissionFactory',
	'SingleContestFactory',
	function($scope, $rootScope, $routeParams, $interval, $location, Notification, catalog, tag, submission, singleContest) {
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

		$scope.id = $routeParams.id;
		$scope.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		$scope.loadingData = true;
		$scope.submittingProblem = false;
		$scope.pendingSubmissions = {};
		$scope.verdictName = {
			"-4": "Compilando...",
			"-3": "Executando...",
			"-2": "Compilando...",
			"-1": "Enviado para Correção",
			"0": "Pendendo",
			"1": "Aceito",
			"2": "Resposta Errada",
			"3": "Tempo Limite Excedido",
			"4": "Erro de Compilação",
			"5": "Erro durante Execução",
			"6": "Limite de Memória Excedido",
			"7": "Limite de Escrita Excedido",
			"8": "Erro de Formatação",
			"9": "Erro Desconhecido",
			"10": "Uso de função restrita",
			"11": "Submissão inválida",
			"15": "Rascunho"
		};
		$scope.languages = {
			"cpp": "C++",
			"java": "Java"
		};

		$scope.submission = {
			contestId: $scope.id
		};

		$scope.toggleUpsolving = function() {
			var tmp = $scope.ord;
			$scope.ord = $scope.ord2;
			$scope.ord2 = tmp;

			tmp = $scope.scores;
			$scope.scores = $scope.scores2;
			$scope.scores2 = tmp;

			tmp = $scope.submissions;
			$scope.submissions = $scope.submissions2;
			$scope.submissions2 = tmp;

			if (!$scope.$$phase) {
				$scope.$digest();
			}
		};

		$scope.getMinutesBetweenDates = function(startDate, endDate) {
			return Math.floor(((new Date(endDate)) - (new Date(startDate))) / 60000);
		};

		$scope.getSecondsBetweenDates = function(startDate, endDate) {
			return Math.floor(((new Date(endDate)) - (new Date(startDate))) / 1000);
		};

		$scope.refreshScoreboard = function() {
			if ($scope.allSubmissions && $scope.timeLeft === 0 && $scope.timeline.moment <= $scope.timeline.options.max) {
				$scope.scores = singleContest.getScoreMap($scope.allSubmissions, $scope.timeline.moment);
				$scope.ord = singleContest.getLeadershipOrder($scope.contestants, $scope.problems, $scope.scores);
				if (!$scope.$$phase) {
					$scope.$digest();
				}
			}
		};

		var lastSlide = 0;
		$scope.timeAndRefreshScoreboard = function() {
			var now = new Date();
			// 100 ms to change scoreboard
			if (now - lastSlide > 100 || $scope.timeline.moment === 0 || $scope.timeline.moment == $scope.timeline.options.max) {
				$scope.refreshScoreboard();
				lastSlide = now;
			}
		};

		var getDynamicScoreboard = function() {
			singleContest.getDynamicScoreboard({
					id: $scope.id
				})
				.then(function(data) {
					$scope.allSubmissions = data.submissions;
				});
		};

		$scope.setBarType = function() {
			if ($scope.timeLeft > 0) {
				if ($scope.timeLeft > $scope.timeToFrozen) {
					$scope.barType = 'success';
				}
				if ($scope.timeLeft <= $scope.timeToFrozen && $scope.timeLeft > $scope.timeToBlind && $scope.barType != 'warning') {
					$scope.barType = 'warning';
					if ($scope.inContest) {
						Notification.warning('A competição está Frozen! A partir de agora, o placar não será mais atualizado, mas você ainda terá acesso ao resultado de suas submissões!');
					} else {
						Notification.warning('A competição está Frozen! A partir de agora, o placar não será mais atualizado.');
					}
				}
				if ($scope.timeLeft <= $scope.timeToBlind && $scope.barType != 'danger') {
					$scope.barType = 'danger';
					if ($scope.inContest) {
						Notification.error('A competição está Blind! A partir de agora, você não terá mais acesso ao resultado de nenhuma submissão, inclusive as suas!');
					} else {
						Notification.error('A competição está Blind! A partir de agora, ninguém tem acesso ao resultado de nenhuma submissão, inclusive as próprias.');
					}
				}
			} else if ($scope.timeLeft === 0) {
				$scope.barType = 'info';
				Notification.info('A competição acabou!');
			}
		};

		var getVerdictFunction = function(verdict) {
			if (!verdict || verdict < 0 || verdict > 10) {
				return 'info';
			}
			if (verdict == 1) {
				return 'success';
			} else if (verdict == 2) {
				return 'error';
			} else if (verdict == 8) {
				return 'warning';
			}
			return 'info';
		};

		var updateScoreboard = function() {
			singleContest.getScoreboard({
				id: $scope.id
			}).then(function(data) {
				$scope.scores = data.scores;
				$scope.contestants = data.contestants;
				$scope.submissions = data.submissions;

				for (var i = 0; i < $scope.submissions.length; i++) {
					var id = $scope.submissions[i]._id;
					var verdict = $scope.submissions[i].verdict;
					if ($scope.pendingSubmissions[id] && verdict >= 1 && verdict <= 10) {
						var msg = "Problema " + $scope.problems[$scope.submissions[i].problem].letter + ": " + $scope.verdictName[verdict];
						Notification[getVerdictFunction(verdict)]({
							message: msg,
							delay: 20000
						});
						delete $scope.pendingSubmissions[id];
					} else if (!$scope.pendingSubmissions[id] && (verdict < 1 || verdict > 10)) {
						$scope.pendingSubmissions[id] = true;
					}
				}
				$scope.ord = singleContest.getLeadershipOrder($scope.contestants, $scope.problems, $scope.scores);
				if (!$scope.$$phase) {
					$scope.$digest();
				}
			}, function(err) {
				Notification.error('Você precisa estar registrado nessa competição para visualizá-la');
				$location.path('/contests/open');
			});
		};

		var getScoreboard = function() {
			singleContest.getScoreboard({
					id: $scope.id
				})
				.then(function(data) {
					$scope.name = data.name;
					$scope.contestantId = data.contestantId;
					$scope.totalDuration = $scope.getSecondsBetweenDates(data.start, data.end);
					$scope.timeline.options.max = Math.floor($scope.totalDuration / 60);
					$scope.timeline.moment = $scope.timeline.options.max;

					$scope.problems = {};
					$scope.problemsArray = data.problems;
					for (var k in data.problems) {
						$scope.problems[data.problems[k]._id] = {
							num: k,
							letter: $scope.alphabet[k],
							url: data.problems[k].url,
							id: data.problems[k]._id
						};
					}

					$scope.inContest = data.inContest;
					$scope.contestants = data.contestants;
					$scope.scores = data.scores;
					$scope.ord = singleContest.getLeadershipOrder($scope.contestants, $scope.problems, $scope.scores);
					$scope.submissions2 = data.submissions;
					$scope.submissions = data.submissions.filter(function(obj) {
						return obj.time * 60 < $scope.totalDuration;
					});

					for (var i = 0; i < $scope.submissions.length; i++) {
						var id = $scope.submissions[i]._id;
						var verdict = $scope.submissions[i].verdict;
						if (verdict < 1 || verdict > 10) {
							$scope.pendingSubmissions[id] = true;
						}
					}

					$scope.timeLeft = Math.max($scope.getSecondsBetweenDates(new Date(), data.end), 0);
					$scope.timeToFrozen = $scope.getSecondsBetweenDates(data.frozen, data.end);
					$scope.timeToBlind = $scope.getSecondsBetweenDates(data.blind, data.end);
					$scope.progressBarValue = $scope.totalDuration - $scope.timeLeft;
					var refreshCounter = 0;

					if ($scope.timeLeft === 0) {
						$scope.scores2 = data.upsolvingScores;
						$scope.ord2 = singleContest.getLeadershipOrder($scope.contestants, $scope.problems, $scope.scores2);
					}

					if ($scope.timeLeft > 0) {
						$scope.setBarType();
						var promise =
							$interval(function() {
								$scope.timeLeft--;
								$scope.progressBarValue++;
								$scope.setBarType();
								if ($scope.timeLeft <= 0) {
									getDynamicScoreboard();
									$interval.cancel(promise);
								} else {
									refreshCounter++;
									if (refreshCounter >= 3) {
										updateScoreboard();
										refreshCounter = 0;
									}
								}
							}, 1000);
						$rootScope.intervalPromises.push(promise);
					} else {
						getDynamicScoreboard();
						$scope.timeline.moment = $scope.timeline.options.max;
						$scope.barType = 'info';
					}

					$scope.loadingData = false;
					getCatalog();
				}, function(err) {
					Notification.error('Você precisa estar registrado nessa competição para visualizá-la');
					$location.path('/contests/open');
				});
		};

		$scope.getPenalty = function(B, A) {
			if ($scope.scores[A] && $scope.scores[A][B] && $scope.scores[A][B].status == 1) {
				return $scope.scores[A][B].time + " (" + $scope.scores[A][B].errorCount + ")";
			} else {
				if ($scope.scores[A] && $scope.scores[A][B] && $scope.scores[A][B].errorCount > 0) {
					return "(" + $scope.scores[A][B].errorCount + ")";
				}
				return "";
			}
		};

		$scope.getScoreClass = function(B, A) {
			if ($scope.scores[A] && $scope.scores[A][B] && $scope.scores[A][B].status == 1) {
				return 'green-score';
			} else {
				var rclass = '';
				if ($scope.scores[A] && $scope.scores[A][B]) {
					if ($scope.scores[A][B].errorCount > 0) {
						rclass += 'red-score';
					} else {
						rclass += 'gray-score';
					}
					if ($scope.scores[A][B].status === 0) {
						rclass += ' smooth_blink';
					}
				}
				return rclass;
			}
		};

		$scope.getSubmissionClass = function(verdict) {
			if (verdict == 15) {
				return 'draft-submission';
			}
			if (!verdict || verdict < 0 || verdict > 10) {
				return 'pending-submission';
			}
			if (verdict == 1) {
				return 'accepted-submission';
			} else if (verdict == 2) {
				return 'wa-submission';
			} else if (verdict == 8) {
				return 'pe-submission';
			}
			return 'error-submission';
		};

		$scope.submit = function() {
			var canSubmit = true;

			$scope.submittingProblem = true;
			if (!$scope.submission.code || $scope.submission.code.length === 0) {
				Notification('O código não pode estar vazio.');
				canSubmit = false;
			}
			if (!$scope.submission.language) {
				Notification('Você deve selecionar uma linguagem.');
				canSubmit = false;
			}
			if (!$scope.submission.problem) {
				Notification('Você deve selecionar um problema.');
				canSubmit = false;
			}
			if (canSubmit) {
				submission.send($scope.submission)
					.then(function(data) {
						Notification("Questão submetida!");
						$scope.submittingProblem = false;
						$scope.submissions.push(data.submission);
						$scope.submission.code = $scope.submission.problem = $scope.submission.language = null;
						$scope.pendingSubmissions[data.submission._id] = true;

						if (!$scope.$$phase) {
							$scope.$digest();
						}
					}, function(err) {
						Notification(err);
						$scope.submittingProblem = false;
					});
			} else {
				$scope.submittingProblem = false;
			}
		};

		$scope.timeline = {
			moment: 5256000,
			options: {
				orientation: 'horizontal',
				min: 0,
				max: 5256000,
				range: 'min',
				change: $scope.refreshScoreboard,
				slide: $scope.timeAndRefreshScoreboard
			}
		};
		getScoreboard();
	}
]).filter('formatTime', [function() {
	return function(seconds, trailingZero) {
		var str = "";
		var suffix = "";
		if (seconds < 0) {
			seconds = -seconds;
			suffix = " para começar";
		}
		var h = Math.floor(seconds / 60 / 60);
		var m = Math.floor(seconds / 60) % 60;
		var s = seconds % 60;
		if (h > 0) {
			str = h + "hr";
			if (trailingZero !== false || m > 0) {
				str = h + "hr e " + m + "min";
			}
		} else if (m >= 10) str = m + "min";
		else if (m > 0) str = m + "min e " + s + "seg";
		else str = s + "seg";
		return str + suffix;
	};
}]).filter('formatDuration', [function() {
	return function(minutes, noTrailingZero) {
		var h = Math.floor(minutes / 60);
		var m = minutes % 60;
		var str = "";
		if (h > 0) {
			str = h + "hr";
			if (m > 0 || !noTrailingZero) {
				str += " e " + m + "min";
			}
			return str;
		}
		return m + "min";
	};
}]).filter('problemSubmitName', [function() {
	return function(problem, index) {
		return "(" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ" [index] + ") " + problem.name;
	};
}]);
