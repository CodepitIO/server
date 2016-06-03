var app = angular.module('Contests')
app.controller('SettingsDataController', [
  '$scope',
  'SettingsState',
  function ($scope, settingsState) {
    $scope.settingsState = settingsState

    var today = new Date(), sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(today.getMonth() + 6)
    $scope.options = {
      start: {
        dateDisabled: false,
        formatYear: 'yy',
        startingDay: 1,
        minDate: today,
        maxDate: sixMonthsFromNow,
      },
      end: {
        dateDisabled: false,
        formatYear: 'yy',
        startingDay: 1,
        minDate: today,
        maxDate: sixMonthsFromNow,
      }
    }
    $scope.opened = {}

    $scope.openDatepicker = function(type) {
      $scope.opened[type] = true;
    }

    $scope.validateTimeRange = function() {
      if (!settingsState.contest.date_start || !settingsState.contest.date_end) {
        return
      }
      settingsState.contest.date_end = Math.max(
        settingsState.contest.date_start,
        settingsState.contest.date_end
      )
    }
  }
])
