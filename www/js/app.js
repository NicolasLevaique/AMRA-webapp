// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'geolocation'])

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
      }
//      ,
//      resolve: {
//        position: function(geolocation) {
//          console.log('tesssssssst')
//          return geolocation.getLocation();
//        },
//        suggestedPaths: function(position, PathsService) {
////          var suggestPaths = function (position) {
//            return PathsService.getSuggestedPaths(position, 200000).then(function (result) {
//              console.dir(result.paths);
//              return result.paths;
//            });
////          };
//
////          if (navigator.geolocation) {
////            console.log('geoloc1');
//////      var options = {enableHighAccuracy: true,timeout:2000};
////            return navigator.geolocation.getCurrentPosition(suggestPaths);
////            console.log('toto');
////
////          } else {
////            alert("your browser doesn't support %GeoLocation");
////          }
//
//        },
//        toto: function() { return 'tototoooooooooooooooooooooooooooooooo'}
//      }
    })

//    .state('app.path', {
//      url: "/path/:pathId",
//      views: {
//        'menuContent' :{
//          templateUrl: "templates/followPath.html",
//          controller: 'PathsCtrl'
//        }
//      }
//    })
//      .state('app.paths.index', {
//      url: '',
//      views: {
//        'menuContent': {
//          templateUrl: "templates/paths.html",
//          controller: 'PathsCtrl'
//        }
//      }
//    })
//    .state('app.paths', {
//      url: "/paths/:pathId",
////      abstract: true,
//      views: {
//        'menuContent' :{
//          templateUrl: "templates/path.html",
//          controller: 'PathsCtrl'
////          controller: function($stateParams) {
////            console.log('path : ' + $stateParams.pathId);
////          }
//        }
//      }
//      ,
//      resolve: {
//        path: function($stateParams, PathService) {
//          console.log('toto');
//          PathService.getPath($stateParams.pathId).then(function (path) {
//            console.dir(path);
//            return path;
//          });
////          return PathService.getPath($stateParams.pathId)
//        }
//      }
//    })
    .state('app.description', {
      url: "/description/:pathId",
      views: {
        'menuContent': {
          templateUrl: "templates/path.html",
          controller: 'PathsCtrl'
//          controller: function($scope) { $scope.path = {title: 'testTitleNav', description: "testDescription"}; console.log("description")}
        }
      }
    })
    .state('app.follow', {
      url: "/follow/:pathId",
      views: {
        'menuContent' :{
          templateUrl: "templates/followPath.html",
          controller: 'PathsCtrl'
//          controller: function($scope, $stateParams) {
//            $scope.path = {};
//            $scope.path.id = $stateParams.pathId;
//            console.log("follow");
//          }
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