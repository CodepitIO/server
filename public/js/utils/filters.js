angular.module('General')
	.filter('formatTime', [function() {
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
	}])
	.filter('formatDuration', [function() {
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
	}])
	.filter('mrtProblemSubmitName', [function() {
		return function(problem, index) {
			return "(" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ" [index] + ") " + problem.name;
		};
	}])
	.filter('mrtTimezoneStrap', function() {
		var regex = /^(Z|[+-])(2[0-3]|[01][0-9]):([0-5][0-9])$/;
		return function(text) {
			if (typeof(text) !== 'string' || text.length === 0) {
				return '';
			}
			var arr = text.match(regex);
			return arr[1] + parseInt(arr[2], 10) + (arr[3] == '00' ? '' : arr[3]);
		};
	});
