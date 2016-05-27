angular.module('Account')
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
            Post: {
              create: true
            }
          },
          templateUrl: 'views/account/profile.posts.dialog.html',
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
    'BlogFacade',
    'Post',
    function ($scope, $mdDialog, blog, post) {
      $scope.post = {
        title: post && post.title || '',
        body: post && post.body || ''
      }
      $scope.create = (post.create === true)
      $scope.cancel = function () {
        $mdDialog.cancel()
      }
      $scope.submit = function () {
        blog.post($scope.post)
      }
    }
  ])
