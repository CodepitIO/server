angular.module('SocketService', []).factory('SocketFactory', [
	'socketFactory',
	function(socketFactory) {
		return socketFactory();
	}
]);
