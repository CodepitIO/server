var app = angular.module('Contests');
app.controller('SubmissionsController', [
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

	}
]);
