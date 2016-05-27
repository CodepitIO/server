var app = angular.module('Contests')
app.controller('EditContestController', [
  '$scope',
  '$rootScope',
  '$stateParams',
  '$timeout',
  '$interval',
  '$location',
  'Notification',
  'ProblemsFactory',
  'ContestsFactory',
  'ContestInstanceAPI',
  function ($scope, $rootScope, $stateParams, $timeout, $interval, $location, Notification, problems, contests, contestInstance) {
    $scope.name = ''
    $scope.descr = ''
    $scope.startDateTime = new Date()
    $scope.endDateTime = new Date()
    $scope.password = ''
    $scope.confirmPassword = ''
    $scope.problems = []
    $scope.contestantType = '3'

    // Originals
    $scope.originalStartDateTime = new Date()
    $scope.originalProblems = []

    $scope.hasStarted = true
    $scope.watchPrivate = null
    $scope.access = ''
    $scope.hours = 0
    $scope.minutes = 0
    $scope.frozenHours = 0
    $scope.frozenMinutes = 0
    $scope.blindHours = 0
    $scope.blindMinutes = 0
    $scope.loadingEdit = false
    $scope.showDescrField = false
    $scope.opened = false
    $scope.minDate = new Date()
    $scope.maxDate = new Date()
    $scope.maxDate.setFullYear($scope.maxDate.getFullYear() + 4)
    $scope.startDateTime.setSeconds(0)
    $scope.startDateTime.setMinutes($scope.startDateTime.getMinutes() + 10 - $scope.startDateTime.getMinutes() % 10)
    $scope.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    $scope.privatePopover = {
      templateUrl: 'private-contest-password.html',
      title: 'Competição Privada'
    }

    $scope.problemRegex = ''
    $scope.fetchedProblems = []
    var lastTime = 0

    function getMinutesBetweenDates (startDate, endDate) {
      return Math.floor((endDate - startDate) / 60000)
    }

    var getContestData = function () {
      contestInstance.getFullData({
        id: $stateParams.id
      })
        .then(function (data) {
          data = data.contest
          data.date_start = new Date(data.date_start)
          data.date_end = new Date(data.date_end)
          data.frozen_time = new Date(data.frozen_time)
          data.blind_time = new Date(data.blind_time)

          $scope.name = data.name
          $scope.descr = data.descr
          $scope.startDateTime = data.date_start
          $scope.originalStartDateTime = data.date_start
          $scope.hasStarted = (data.date_start <= new Date())
          $scope.minutes = getMinutesBetweenDates(data.date_start, data.date_end)
          $scope.frozenMinutes = getMinutesBetweenDates(data.frozen_time, data.date_end)
          $scope.blindMinutes = getMinutesBetweenDates(data.blind_time, data.date_end)
          $scope.updateEndDateTime()
          $scope.problems = data.problems
          $scope.password = data.password || ''
          $scope.confirmPassword = data.password || ''
          $scope.access = (data.isPrivate ? 'Privado' : 'Público')
          $scope.originalProblems = $.extend(true, [], data.problems)
          $scope.contestantType = data.contestantType + ''
          $scope.watchPrivate = (data.watchPrivate ? 1 : 0)
        }, function (err) {
          console.log(err)
          $location.path('/')
        })
    }
    getContestData()

    $scope.fetch = function () {
      var now = Date.now()
      lastTime = now
      if ($scope.problemRegex.length >= 3) {
        $timeout(function () {
          if (lastTime == now) {
            problems.fetch({
              regex: $scope.problemRegex,
              problems: $scope.problems
            })
              .then(function (data) {
                if (data.error) {
                  toastr.error(data.error)
                } else {
                  $scope.fetchedProblems = data.problems
                }
              })
          }
        }, 400)
      } else {
        $scope.fetchedProblems = []
      }
    }

    $scope.addProblem = function (problem) {
      if ($scope.problems.length >= 26) {
        Notification('A competição pode ter no máximo 26 problemas.')
      } else {
        $scope.problems.push(problem)
        $scope.fetchedProblems = $scope.fetchedProblems.filter(function (obj) {
          return obj.id.toString() != problem.id.toString()
        })
      }
    }

    $scope.removeProblem = function (id) {
      $scope.problems = $scope.problems.filter(function (elem) {
        return elem.id.toString() != id.toString()
      })
    }

    $scope.hasToggled = false
    $scope.fireToggleContestAccess = function () {
      $timeout(function () {
        $scope.hasToggled = true
        $('#accessPopover').trigger('toggleContestAccess')
      }, 0)
    }

    $scope.toggleAccess = function () {
      if ($scope.hasToggled || $scope.access == 'Público') {
        $scope.fireToggleContestAccess()
      }
      if ($scope.access == 'Privado') $scope.access = 'Público'
      else $scope.access = 'Privado'
    }

    $scope.isAccess = function (access) {
      return $scope.access == access
    }

    $scope.updateBlind = function () {
      $scope.frozenDuration = $scope.frozenHours * 60 + $scope.frozenMinutes
      $scope.blindHours = $scope.blindHours || 0
      $scope.blindMinutes = $scope.blindMinutes || 0
      $scope.blindDuration = Math.min($scope.blindHours * 60 + $scope.blindMinutes, $scope.frozenDuration)
      $scope.blindDuration = Math.max($scope.blindDuration, 0)
      $scope.blindDateTime = new Date($scope.endDateTime)
      $scope.blindDateTime.setMinutes($scope.blindDateTime.getMinutes() - $scope.blindDuration)
      $scope.blindHours = Math.floor($scope.blindDuration / 60)
      $scope.blindMinutes = $scope.blindDuration % 60
    }

    $scope.updateFrozen = function () {
      $scope.duration = getMinutesBetweenDates($scope.startDateTime, $scope.endDateTime)
      $scope.frozenHours = $scope.frozenHours || 0
      $scope.frozenMinutes = $scope.frozenMinutes || 0
      $scope.frozenDuration = Math.min($scope.frozenHours * 60 + $scope.frozenMinutes, $scope.duration)
      $scope.frozenDuration = Math.max($scope.frozenDuration, 0)
      $scope.frozenDateTime = new Date($scope.endDateTime)
      $scope.frozenDateTime.setMinutes($scope.frozenDateTime.getMinutes() - $scope.frozenDuration)
      $scope.frozenHours = Math.floor($scope.frozenDuration / 60)
      $scope.frozenMinutes = $scope.frozenDuration % 60
      $scope.updateBlind()
    }

    $scope.updateEndDateTime = function () {
      $scope.endDateTime = new Date($scope.startDateTime)
      $scope.hours = $scope.hours || 0
      $scope.minutes = $scope.minutes || 0
      $scope.duration = Math.max($scope.hours * 60 + $scope.minutes, 0)
      $scope.duration = Math.min($scope.duration, 365 * 24 * 60)
      $scope.endDateTime.setMinutes($scope.endDateTime.getMinutes() + $scope.duration)
      $scope.hours = Math.floor($scope.duration / 60)
      $scope.minutes = $scope.duration % 60
      $scope.validDuration = ($scope.duration >= 10)
      $scope.updateFrozen()
    }

    $scope.open = function () {
      $timeout(function () {
        $scope.opened = true
      })
    }

    $scope.edit = function () {
      $scope.loadingEdit = true
      var password = ($scope.access == 'Privado' && $scope.password) || ''
      var confirmPassword = ($scope.access == 'Privado' && $scope.confirmPassword) || ''
      contestInstance.edit({
        id: $stateParams.id,
        name: $scope.name,
        descr: $scope.descr,
        startDateTime: $scope.startDateTime,
        endDateTime: $scope.endDateTime,
        frozenDateTime: $scope.frozenDateTime,
        blindDateTime: $scope.blindDateTime,
        contestantType: $scope.contestantType,
        password: password,
        confirmPassword: confirmPassword,
        problems: $scope.problems,
        watchPrivate: $scope.watchPrivate
      })
        .then(function (data) {
          Notification('Competição editada!')
          $scope.loadingCreate = false
          $location.path('/contests/owned')
        }, function (error) {
          Notification.error(error)
          $scope.loadingCreate = false
        })
    }

    var promise = $interval(function () {
      $scope.updateEndDateTime()
      if (!$scope.hasStarted && ($scope.originalStartDateTime <= new Date())) {
        $scope.hasStarted = true
        $scope.problems = $scope.originalProblems
        if (!$scope.$$phase) {
          $scope.$digest()
        }
        Notification('A competição começou. Você não pode mais mudar os problemas e a data de início.')
      }
    }, 1000)
    $rootScope.intervalPromises.push(promise)
  }
]).directive('gtDateEdit', ['$interval', function ($interval) {
  return {
    require: 'ngModel',
    link: function ($scope, $elem, $attrs, ngModel) {
      var validate = function (value) {
        if (!value || value < new Date()) {
          ngModel.$setValidity('gtDateEdit', false)
          return value
        }
        ngModel.$setValidity('gtDateEdit', true)
        return value
      }

      $attrs.$observe('gtDateEdit', function (date) {
        $scope.updateEndDateTime()
        return validate(ngModel.$viewValue)
      })

      ngModel.$parsers.unshift(function (value) {
        return validate(value)
      })
      ngModel.$formatters.unshift(function (value) {
        return validate(value)
      })
    }
  }
}])
