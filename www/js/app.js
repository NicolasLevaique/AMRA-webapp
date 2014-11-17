// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
          controller: 'HomeCtrl'
        }
      },
      resolve: {
        position: function($geolocation) {
          return $geolocation.getCurrentPosition();
        },
        suggestedPaths: function(position, PathsService) {
          return PathsService.getSuggestedPaths(position, 2000000).then(function (result) {
            console.dir(result);
            return result.paths;
          })
        }
      }
    })

    .state('app.description', {
      url: "/paths/description/:pathId",
      views: {
        'menuContent': {
          templateUrl: "templates/path.html",
          controller: 'PathCtrl'
        }
      },
      resolve: {
        path: function($stateParams, PathService) {
          return PathService.getPath($stateParams.pathId);
        }
      }
    })
    .state('app.follow', {
      url: "/paths/follow/:pathId",
      views: {
        'menuContent' :{
          templateUrl: "templates/followPath.html",
          controller: 'FollowPathCtrl'
//          controller: function($scope, $stateParams) {
//            $scope.path = {};
//            $scope.path.id = $stateParams.pathId;
//            console.log("follow");
//          }
        }
      },
      resolve: {
        path: function($stateParams, PathService) {
          return PathService.getPath($stateParams.pathId);
        }
      }
//      ,
//      resolve: {
//        path: function($stateParams, PathService) {
//          console.log('toto');
//          return PathService.getPath($stateParams.pathId)
//        }
//      }
    })
//    .state('app.playlists', {
//      url: "/playlists",
//      views: {
//        'menuContent' :{
//          templateUrl: "templates/path.html",
//          controller: 'PlaylistsCtrl'
//        }
//      }
//    })
//
//    .state('app.single', {
//      url: "/home/:pathId",
//      views: {
//        'menuContent' :{
//          templateUrl: "templates/followPath.html",
//          controller: 'PlaylistCtrl'
//        }
//      }
//    })

//      .state('app.checkpointView', {
//        url: "/checkpointView",
//        views: {
//          'menuContent' :{
//            templateUrl: "templates/checkpointView.html",
//            controller: 'CheckPointCtrl'
//          }
//        }
//      }
//)
    ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});