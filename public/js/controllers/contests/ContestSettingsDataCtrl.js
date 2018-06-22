var app = angular.module('Contests');
app.controller('ContestSettingsDataController', function ($scope, TimeState) {
    $scope.timeState = TimeState;

    var today = new Date(), sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    $scope.options = {
      dateDisabled: false,
      formatYear: 'yy',
      startingDay: 1,
      maxDate: sixMonthsFromNow,
    };
    $scope.opened = {};

    $scope.openDatepicker = function(type) {
      $scope.opened[type] = true;
    };
  });
