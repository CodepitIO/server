var app = angular.module('Contests')
app.controller('SettingsDataController', [
  '$scope',
  'SettingsState',
  'TimeState',
  function ($scope, settingsState, timeState) {
    $scope.settingsState = settingsState
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
