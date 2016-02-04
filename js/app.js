// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
//Set up angular and injectng the added services
var BlogApp = angular.module('BlogApp', ['ionic', 'ngRoute', 'ngSanitize'])

.run(function($ionicPlatform, $rootScope, $location) {

  //Adding in anonymous function  - when clicked set the URL to /list (home page)
  $rootScope.goHome = function() {
    $location.path('/list');
  };

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

//Setting up routes
//If you want to minimize your JS, you need to include that array or stuff will break
//Not 100% neccessary it's just best practice
BlogApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider

  .when('/list', {
    controller: 'ListController',
    templateUrl: 'partials/list.html'
  })

  .when('/details/:itemId', {
    controller: 'DetailsController',
    templateUrl: 'partials/details.html'
  })

  .otherwise({redirectTo: '/list'});

}]);

BlogApp.controller('ListController', ['$scope', '$http', '$ionicLoading', function($scope, $http, $ionicLoading) {
  $scope.loadBlogs = function() {
    $ionicLoading.show();
    $http.get('https://public-api.wordpress.com/rest/v1.1/freshly-pressed')
    .success(function(response) {
      //console.log(response);
      $scope.posts = response.posts;
      $ionicLoading.hide();
    })
    .finally(function() {
      $scope.broadcast('scroll.refreshComplete');
    });
  };
  $scope.loadBlogs();

}]);

BlogApp.controller('DetailsController', ['$scope', '$http', '$ionicLoading', '$routeParams', function($scope, $http, $ionicLoading, $routeParams) {
  $scope.loadBlog = function() {
    $ionicLoading.show();
    $http.get('https://public-api.wordpress.com/rest/v1.1/freshly-pressed/')
    .success(function(response) {
      //console.log(response);
      $scope.title = response.posts[$routeParams.itemId].title;
      $scope.fullPost = response.posts[$routeParams.itemId].content;
      $ionicLoading.hide();
    })
    .finally(function() {
      $scope.broadcast('scroll.refreshComplete');
    });
  };
  $scope.loadBlog();

}]);

//Setting up a factory for API url will prevent you from having too type of the URL 
//multiple times for different calls