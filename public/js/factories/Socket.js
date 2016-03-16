angular.module('Socket').factory('SocketFactory', [
	'socketFactory',
	function(socketFactory) {
		return socketFactory();
	}
]);
