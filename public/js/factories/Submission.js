angular.module('Submission')
	.factory('SubmissionAPI', [
		'$q',
		'$resource',
		'RequestAPI',
		function($q, $resource, request) {
			var SendAPI = $resource('/api/v1/submission/send', {
				contestId: '@contestId',
				code: '@code',
				problem: '@problem',
				language: '@language'
			});
			var GetAPI = $resource('/api/v1/submission/:id', {});
			return {
				send: request.send('save', SendAPI),
				get: request.send('get', GetAPI),
			};
		}
	])
	.factory('SubmissionFunctions', [
		'Upload',
		'Notification',
		'SubmissionAPI',
		function(Upload, Notification, SubmissionAPI) {
			return {
				// Send submission
				send: function(submission, contestId, callback) {
					var canSubmit = true;
					if ((!submission.code || submission.code.length === 0) &&
						!submission.codefile) {
						Notification('Você deve enviar o código.');
						canSubmit = false;
					}
					if (!submission.codefile && submission.code && submission.code.length > 64 * 1024) {
						Notification('O código que você está tentando submeter tem mais do que 64KB.');
						canSubmit = false;
					}
					if (!submission.language) {
						Notification('Você deve selecionar uma linguagem.');
						canSubmit = false;
					}
					if (!submission.problem) {
						Notification('Você deve selecionar um problema.');
						canSubmit = false;
					}
					if (!canSubmit) return callback();

					var promise;
					if (submission.codefile) {
						promise = Upload.upload({
							url: '/api/v1/submission/sendfile',
							data: {
								file: submission.codefile,
								contestId: contestId,
								problem: submission.problem,
								language: submission.language,
							}
						});
					} else {
						promise = SubmissionAPI.send({
							code: submission.code,
							contestId: contestId,
							problem: submission.problem,
							language: submission.language,
						});
					}
					promise.then(
						function(data) {
							Notification('Código enviado!');
							return callback(null, data);
						},
						callback
					);
				}
			};
		}
	]);
