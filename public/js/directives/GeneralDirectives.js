var app = angular.module('General')

app.directive('confirmedClick', [function () {
  return {
    link: function (scope, element, attr) {
      var msg = attr.ngConfirmClick || 'Você tem certeza?'
      var clickAction = attr.confirmedClick
      element.bind('click', function (event) {
        if (window.confirm(msg)) {
          scope.$eval(clickAction)
        }
      })
    }
  }
}])

app.directive('mrtBreadcrumbs', function () {
  return {
    restrict: 'E',
    scope: {
      title: '=',
      location: '='
    },
    templateUrl: 'views/misc/breadcrumbs.html'
  }
})

app.directive('mrtMatchField', [function () {
  return {
    require: 'ngModel',
    link: function ($scope, $elem, $attrs, ngModel) {
      var validate = function (value) {
        var comparisonModel = $attrs.mrtMatchField
        if (comparisonModel != value) {
          ngModel.$setValidity('mrtMatchField', false)
          return value
        }
        ngModel.$setValidity('mrtMatchField', true)
        return value
      }

      $attrs.$observe('mrtMatchField', function (comparisonModel) {
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

app.directive('tooltip', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      $(element).hover(function () {
        $(element).tooltip('show')
      }, function () {
        $(element).tooltip('hide')
      })
    }
  }
})

app.directive('mrtLoadingSpinner', function () {
  return {
    restrict: 'E',
    scope: {
      diameter: '='
    },
    templateUrl: 'views/misc/loading-spinner.html'
  }
})

app.directive('mrtPageWrapper', function () {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      waitFor: '=?',
      waitWhile: '=?',
      color: '=?',
      diameter: '=?',
      alignOpts: '=?'
    },
    templateUrl: 'views/misc/page-wrapper.html',
    controller: ['$scope', function ($scope) {
      $scope.color = angular.isDefined($scope.color) ? $scope.color : '#45a7b9'
      $scope.diameter = angular.isDefined($scope.diameter) ? $scope.diameter : '280'
      $scope.alignOpts = angular.isDefined($scope.alignOpts) ? $scope.alignOpts : 'center'
      $scope.waitFor = angular.isDefined($scope.waitFor) ? $scope.waitFor : true
      $scope.waitWhile = angular.isDefined($scope.waitWhile) ? $scope.waitWhile : false
    }]
  }
})

app.directive('mrtDisplayTime', function () {
  return {
    restrict: 'E',
    scope: {
      date: '='
    },
    template: '<a target="_blank" ' +
      'href="http://www.timeanddate.com/worldclock/fixedtime.html?day={{date.getUTCDate()}}' +
      '&month={{date.getUTCMonth()+1}}&year={{date.getUTCFullYear()}}&' +
      'hour={{date.getUTCHours()}}&min={{date.getUTCMinutes()}}&sec={{date.getUTCSeconds()}}">' +
      "<span>{{date | amUtc | amLocal | amDateFormat:'ddd, D/MMM/YYYY, HH:mm'}}</span>" +
      "<sup>UTC{{date | amUtc | amLocal | amDateFormat:'Z' | mrtTimezoneStrap}}</sup></a>",
    controller: [
      '$scope',
      function ($scope) {
        $scope.date = new Date($scope.date)
      }
    ]
  }
})

app.directive('mrtLoginForm', [function () {
  return {
    restrict: 'E',
    templateUrl: 'views/user/login-form.html',
    controller: 'LoginController'
  }
}])

app.directive('mrtBlogPosts', [function () {
  return {
    restrict: 'E',
    templateUrl: 'views/misc/blog-posts.html',
    scope: {
      user: '=?',
      pagePath: '=?',
      isInfo: '=?'
    },
    controller: [
      '$scope',
      '$state',
      '$stateParams',
      '$mdDialog',
      '$mdMedia',
      'PostFacade',
      function ($scope, $state, $stateParams, $mdDialog, $mdMedia, post) {
        $scope.user = $scope.user

        $scope.page = {
          current: $stateParams.page || 1,
          maxDisplay: 10,
          total: 0,
          posts: []
        }

        $scope.loading = true
        function fetchPosts () {
          $scope.loading = true
          post.get($scope.user, $scope.pagePath, function (err, posts) {
            $scope.page.posts = posts
            $scope.loading = false
          })
        }

        post.count($scope.user, $scope.pagePath, function (err, count) {
          $scope.page.total = count
          fetchPosts()
        })

        $scope.changePage = function () {
          $state.go('.', { page: $scope.page.current}, { notify: false })
          fetchPosts()
        }

        $scope.editPost = function (data) {
          $mdDialog.show({
            controller: 'ProfilePostsDialogController',
            locals: { ScopeData: data },
            templateUrl: 'views/user/profile.posts.dialog.html',
            clickOutsideToClose: true,
            fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
          })
        }
      }
    ]
  }
}])

app.directive('mrtGoBack', [
  'HistoryState',
  function (historyState) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      if (historyState.isEmpty()) return elem.hide()
      elem.bind('click', historyState.pop)
    },
  }
}])
