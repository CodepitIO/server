angular.module('General')
  .factory('Request', function ($q, $timeout, Notification, Config) {
      var resolveOrReject = function (deferred, result) {
        if (result.error) {
          Notification.error(result.error.pt || result.error);
          deferred.reject(result.error);
        } else {
          deferred.resolve(result);
        }
      };

      var reject = function (deferred, result) {
        result && result.statusText && Notification.error(result.statusText);
        deferred.reject(result && result.statusText);
      };

      return {
        send: function (method, API, opts) {
          if (method === 'post') method = 'save';
          opts = opts || {};
          var lastCall = 0, timer;
          function deferAPI(params) {
            lastCall = new Date();
            timer = null;
            var deferred = $q.defer();
            API[method](
              params,
              resolveOrReject.bind(null, deferred),
              reject.bind(null, deferred)
            );
            return deferred.promise;
          }

          return function(params) {
            if (true || opts.ignoreThrottle) return deferAPI(params);
            if (timer) $timeout.cancel(timer);
            var ellapsed = new Date() - lastCall;
            timer = $timeout(function() {
              return deferAPI(params);
            }, Math.max(Config.ThrottleTime - ellapsed, 0));
            return timer;
          };
        }
      };
    });
