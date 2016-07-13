var app = angular.module('User')

app.directive('mrtUniqueUsername', function($q, UserAPI) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$asyncValidators.mrtUniqueUsername = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return $q.when()
        }
        var def = $q.defer()
        UserAPI.checkUsername(modelValue, function(err, available) {
          if (available) def.resolve()
          else def.reject()
        })
        return def.promise
      }
    }
  }
})

app.directive('mrtUniqueEmail', function($q, UserAPI) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$asyncValidators.mrtUniqueEmail = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return $q.when()
        }
        var def = $q.defer()
        UserAPI.checkEmail(modelValue, function(err, available) {
          if (available) def.resolve()
          else def.reject()
        })
        return def.promise
      }
    }
  }
})
