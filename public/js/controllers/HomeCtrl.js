angular
  .module("Home")
  .controller(
    "PostsController",
    function ($scope, $state, $stateParams, $mdDialog, $mdMedia, PostAPI) {
      $scope.post = {
        title: "",
        body: "",
        page: "home",
      };
      $scope.page = {
        posts: [],
        current: $stateParams.page || 1,
        maxDisplay: 10,
      };

      $scope.$watch("page.current", function () {
        if ($scope.page.current != $stateParams.page) {
          return $state.go(
            $state.current,
            { page: $scope.page.current },
            { reload: true }
          );
        }
      });

      PostAPI.count("home", (err, postsCount) => {
        $scope.page.total = postsCount;
      });

      PostAPI.get("home", $stateParams.page || 1, (err, posts) => {
        if ($stateParams.page != 1 && posts.length == 0) {
          return $state.go("home", { page: 1 }, { reload: true });
        }
        $scope.page.posts = posts;
      });

      $scope.showPostCreationDialog = function () {
        $mdDialog.show({
          controller: "CreatePostController",
          templateUrl: "views/blog/create.posts.html",
          locals: {
            ScopeData: {
              post: $scope.post,
            },
          },
          clickOutsideToClose: true,
          fullscreen: $mdMedia("sm") || $mdMedia("xs"),
          closeTo: {
            left: 1500,
          },
        });
      };
    }
  )
  .controller(
    "CreatePostController",
    function ($scope, $state, $mdDialog, ScopeData, PostAPI) {
      $scope.post = ScopeData.post;
      Quill.register("modules/counter", function (quill) {
        quill.root.innerHTML = $scope.post.body;
        quill.on("text-change", function () {
          $scope.post.body = quill.root.innerHTML;
        });
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.submit = function () {
          PostAPI.post($scope.post, (err) => {
            if (!err) {
              $mdDialog.cancel();
              return $state.go($state.current, null, { reload: true });
            }
          });
        };
      });
    }
  );
