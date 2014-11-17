angular.module('starter.controllers', ['ngGeolocation'])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('MenuCtrl', function($scope, $ionicNavBarDelegate) {
    $scope.onClickBackButton = function() {
      console.log('click on back button');
      $scope.$digest();
    };
  })

  .controller('HomeCtrl', function ($scope, $stateParams, $geolocation, suggestedPaths, position, PathsService/*, PlaylistService*/) {
//    var suggestPaths = function () {
//      var position = $geolocation.getCurrentPosition({
//        timeout: 60000
//      }).then(function (position) {
//        PathsService.getSuggestedPaths(position, 200000).then(function (result) {
//          console.dir(result.paths);
//          $scope.suggestedPaths = result.paths;
//          $scope.playlists = result.paths;
//        });
//      });
//    };
//
//    suggestPaths();
    $scope.suggestedPaths = suggestedPaths;
    $scope.playlists = suggestedPaths;
  })

//  .controller('PathsCtrl', function($scope, PathService, MapService, $stateParams) {
//    $scope.toggleView = true;
//
//    var directionDisplay = null;
//    var init = function() {
//      /** Converts numeric degrees to radians */
//      if (typeof(Number.prototype.toRad) === "undefined") {
//        Number.prototype.toRad = function() {
//          return this * Math.PI / 180;
//        }
//      }
//
//
//      PathService.getPath($stateParams.pathId).then(function (path) {
//        $scope.path = path;
//        var watchPositionId = null;
//        //TODO: center map based on position
//        var centerPos = { lat: 37.7699298,  lng: -122.4469157};
//        directionDisplay = MapService.initMap('map', centerPos);
//
//        var computeRoadFromPositionToFirstCheckPoint = function(position) {
//          console.dir(position);
//          var origin = {"latitude":position.coords.latitude, "longitude": position.coords.longitude};
//          var destination = {"latitude":path.checkpoints[0].latitude, "longitude": path.checkpoints[0].longitude};
//
//          // check http://www.movable-type.co.uk/scripts/latlong.html for more info
//          var φ1 = position.coords.latitude.toRad();
//          var φ2 = path.checkpoints[0].latitude.toRad();
//          var Δλ = (path.checkpoints[0].longitude-position.coords.longitude).toRad();
//          var R = 6371; // earth's radius, gives d in km
//          var d = Math.acos( Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ) ) * R;
//          if (d > 0.3) {
//            MapService.traceRoute(directionDisplay, origin, destination);
//          }
//          else {
//            navigator.geolocation.clearWatch(watchPositionId);
//          }
//        };
//        if (navigator.geolocation) {
//          var options = {enableHighAccuracy: true,timeout:2000};
//          watchPositionId = navigator.geolocation.watchPosition(computeRoadFromPositionToFirstCheckPoint, null /*TODO: errorhandler ! */, options);
//        } else {
//          alert("your browser doesn't support %GeoLocation");
//        }
//      });
//    };
//    init();
//
//    $scope.changeView = function() {
//      console.dir($scope.toggleView);
//      $scope.toggleView = !$scope.toggleView;
//    };
//
//    $scope.goToNextCheckpoint = function(position, nextCheckpoint) {
//      var computeRoadToNextCheckpoint = function (position) {
//        var coordinates = PathService.getCheckpointCoordinates(nextCheckpoint);
//        var origin = {"latitude": position.coords.latitude, "longitude": position.coords.longitude};
//        MapService.traceRoute(directionDisplay, origin, coordinates);
//      };
//      if (navigator.geolocation) {
//        navigator.geolocation.getCurrentPosition(computeRoadToNextCheckpoint);
//      } else {
//        alert("your browser doesn't support %GeoLocation");
//      }
//    };
  .controller('PathCtrl', function($scope, path, PathService, MapService, $stateParams) {
    $scope.path = path;
  })

  .controller('FollowPathCtrl', function($scope, path, PathService, MapService, $geolocation, $stateParams) {
    $scope.path = path;
    var directionDisplay = null;
    var init = function() {
      /** Converts numeric degrees to radians */
      if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
          return this * Math.PI / 180;
        }
      }


      var watchPositionId = null;
      //TODO: center map based on position
      var centerPos = { lat: 37.7699298,  lng: -122.4469157};
      directionDisplay = MapService.initMap('map', centerPos);

      var computeRoadFromPositionToFirstCheckPoint = function() {
        var arrived = false;
        var i = 0;
        var position;
        while (!arrived && i < 10) {
          i++;
          console.log('just before testing if position.coords is undefined:');
          position = $scope.position;
          console.dir(position);
          console.log('end position');
          if (typeof(position.coords) != "undefined") {
            console.log('position.coords was not undefined!');
            var origin = {"latitude": $scope.position.coords.latitude, "longitude": $scope.position.coords.longitude};
            var destination = {"latitude": path.checkpoints[0].latitude, "longitude": path.checkpoints[0].longitude};

            // check http://www.movable-type.co.uk/scripts/latlong.html for more info
            var φ1 = $scope.position.coords.latitude.toRad();
            var φ2 = path.checkpoints[0].latitude.toRad();
            var Δλ = (path.checkpoints[0].longitude - $scope.position.coords.longitude).toRad();
            var R = 6371; // earth's radius, gives d in km
            var d = Math.acos(Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)) * R;
            if (d > 0.3) {
              MapService.traceRoute(directionDisplay, origin, destination);
            }
            else {
              arrived = true;
              $geolocation.clearWatch(watchPositionId);
            }
          }
        }
      };

      $geolocation.getCurrentPosition().then(function(pos) {
        watchPositionId = $geolocation.watchPosition({
          timeout: 60000,
          maximumAge: 250,
          enableHighAccuracy: true
        });
        $scope.position = $geolocation.position /*|| pos*/;
        computeRoadFromPositionToFirstCheckPoint();

      });



    };
    init();
  })



  .controller('MapCtrl', function($scope, MapService) {
    var centerPos = { lat: 37.7699298,  lng: -122.4469157};
    var directionDisplay = MapService.initMap('map', centerPos);

    $scope.calcRoute = function() {
      var origin = {"latitude":37.7699298, "longitude": -122.4469157};
      var destination = {"latitude": 37.7683909618184, "longitude": -122.51089453697205};
      MapService.traceRoute(directionDisplay, origin, destination);
    }
  });