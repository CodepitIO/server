var app = angular.module('Contests')
app.controller('SettingsOptionsController', [
  '$scope',
  'SettingsState',
  function ($scope, settingsState) {
    $scope.settingsState = settingsState
  }
])
