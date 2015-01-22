// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    })
  .directive('map', function () {
    'use strict';
    var directionsDisplay = new google.maps.DirectionsRenderer(),
      directionsService = new google.maps.DirectionsService(),
      geocoder = new google.maps.Geocoder(),
      map,
      marker,
      mapObj,
      infowindow;

    mapObj = {
      restrict: 'EAC',
      scope: {
        origin: '@',
        destination: '@',
        markerContent: '@',
        zoom: '=',
        type: '@',
        directions: '@'
      },
      replace: true,
      templateUrl: '/templates/map.html',
      link: function (scope, element) {
        scope.init = function () {
          var mapOptions = {
            zoom: scope.zoom !== undefined ? scope.zoom : 15,
            mapTypeId: scope.type !== undefined ? scope.type.toLowerCase() : 'roadmap',
            streetViewControl: false
          };
          map = new google.maps.Map(document.getElementById('theMap'), mapOptions); // todo: use angular-element :)
          scope.endPoint = scope.destination !== undefined ? scope.destination : '1600 Amphitheatre Parkway, Santa Clara County, CA';

          geocoder.geocode({
            address: scope.endPoint
          }, function (results, status) {
            var location = results[0].geometry.location;
            if (status === google.maps.GeocoderStatus.OK) {
              map.setCenter(location);
              marker = new google.maps.Marker({
                map: map,
                position: location,
                animation: google.maps.Animation.DROP
              });
              infowindow = new google.maps.InfoWindow({content: scope.markerContent !== undefined ? scope.markerContent : 'Google HQ'});
              google.maps.event.addListener(marker, 'click', function () {
                return infowindow.open(map, marker);
              });

            } else {
              alert('Cannot Geocode');
            }

          });


        };

        scope.init();

        scope.getDirections = function () {
          var request = {
            origin: scope.origin,
            destination: scope.endPoint,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
          };
          directionsService.route(request, function (response, status) {
            return status === google.maps.DirectionsStatus.OK ? directionsDisplay.setDirections(response) : console.warn(status);
          });
          directionsDisplay.setMap(map);

          directionsDisplay.setPanel(document.getElementById('directionsList')); // again need to use angular element thats ugly otherwise.
        };

        scope.clearDirections = function () {
          scope.init();
          directionsDisplay.setPanel(null);
          scope.origin = '';
        };



      }
    };

    return mapObj;



  })

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




.config(function($stateProvider, $urlRouterProvider, $logProvider) {
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
    })

    .state('app.description', {
      url: "/paths/description/:pathId",
      views: {
        'menuContent': {
          templateUrl: "templates/path.html",
          controller: 'PathCtrl'
        }
      }
    })
    .state('app.follow', {
      url: "/paths/follow/:pathId",
      views: {
        'menuContent' :{
          templateUrl: "templates/followPath.html",
          controller: 'FollowPathCtrl'
        }
      }
    })

    .state('app.admin', {
      url: "/admin",
      views: {
        'menuContent' :{
          templateUrl: "templates/admin.html",
          controller: 'AdminCtrl'
        }
      }
    })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
    $logProvider.debugEnabled(true);

  });
