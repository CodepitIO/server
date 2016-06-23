angular.module('User')
  .controller('ProfilePostsController', [
    '$scope',
    '$mdDialog',
    '$mdMedia',
    '$stateParams',
    function ($scope, $mdDialog, $mdMedia, $stateParams) {
      $scope.newPost = function () {
        $mdDialog.show({
          controller: 'ProfilePostsDialogController',
          locals: {
            ScopeData: {
              create: true
            }
          },
          templateUrl: 'views/user/profile.posts.dialog.html',
          clickOutsideToClose: true,
          fullscreen: ($mdMedia('sm') || $mdMedia('xs')),
          closeTo: {
            left: 1500
          }
        })
      }
      $scope.id = $stateParams.id
    }
  ])
  .controller('ProfilePostsDialogController', [
    '$scope',
    '$mdDialog',
    'PostAPI',
    'ScopeData',
    function ($scope, $mdDialog, PostAPI, post) {
      $scope.post = {
        title: post && post.title || '',
        body: post && post.body || ''
      }
      $scope.create = (post && post.create === true)
      $scope.cancel = function () {
        $mdDialog.cancel()
      }
      $scope.submit = function () {
        PostAPI.post($scope.post)
      }
    }
  ])
