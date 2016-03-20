var app = angular.module('InfoContestCtrl', []);
app.controller('InfoContestController', [
	'$scope',
	'$routeParams',
	'Notification',
	'SingleContestFactory',
	function($scope, $routeParams, Notification, singleContest) {
		var contestId = $routeParams.id;

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
			"12": "Erro de Submissão",
			"15": "Rascunho"
		};
		$scope.languages = {
			"c": "C",
			"cpp": "C++",
			"cpp11": "C++11",
			"java": "Java",
		};
		$scope.getSubmissionClass = function(verdict) {
			if (verdict > 8) {
				return 'draft-submission';
			}
			if (!verdict || verdict < 0) {
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

		var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var fetchData = function() {
			singleContest.getParticipants({
				id: contestId
			}).then(function(data) {
				$scope.participants = data.participants;
				$scope.problems = {};
				for (var i in data.problems) {
					$scope.problems[data.problems[i]] = {
						letter: alphabet.charAt(i),
						num: i
					};
				}
				$scope.start = new Date(data.start);
			}, function(err) {
				Notification.error(err);
			});
		};
		fetchData();

		$scope.fetchParticipantSubmissions = function(pid) {
			singleContest.getParticipantSubmissions({
				id: contestId,
				pid: pid,
			}).then(function(data) {
				$scope.submissions = data.submissions;
				for (var i = 0; i < $scope.submissions.length; i++) {
					$scope.submissions[i].time =
						Math.floor((new Date($scope.submissions[i].date) - $scope.start) / 60000);
				}
			}, function(err) {
				Notification.error(err);
			});
		};
	}
]);
