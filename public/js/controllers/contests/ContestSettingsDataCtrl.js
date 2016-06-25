var app = angular.module('Contests')
app.controller('ContestSettingsDataController', [
  '$scope',
  'TimeState',
  function ($scope, timeState) {
    $scope.timeState = timeState

    var today = new Date(), sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(today.getMonth() + 6)
    $scope.options = {
      dateDisabled: false,
      formatYear: 'yy',
      startingDay: 1,
      minDate: today,
      maxDate: sixMonthsFromNow,
    }
    $scope.opened = {}

    $scope.openDatepicker = function(type) {
      $scope.opened[type] = true;
    }
  }
])
