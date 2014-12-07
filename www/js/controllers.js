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

  // .controller('PlaylistCtrl', function ($scope, $stateParams, PlaylistService) {
  // PlaylistService.findById($stateParams.playlistId).then(function(playlist) {
  // $scope.checkpoints = [
  // { title : 'checkpoint 1', pic : 'path1.jpg' , id: 1},
  //{ title : 'checkpoint 2', pic : 'path2.jpg' , id: 2}
  //]
  //$scope.playlist = playlist;
  //});
  //})

  .controller('PathCtrl', function($scope, path) {
    $scope.path = path;
    $scope.checkpointsDisplayLimit = 5;
  })

  .controller('FollowPathCtrl', function($scope, path, PathService, MapService, $geolocation, $stateParams, $timeout) {

    $scope.path = path;
    var directionDisplay = null;
//    var nextCheckpoint = 0;
    $scope.showMap = true;
    $scope.nextCheckpointNumber = 0;
    $scope.nextCheckpoint = path.checkpoints[$scope.nextCheckpointNumber];

    var computeDistance = function(origin, destination) {

      /** Converts numeric degrees to radians */
      if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function () {
          return this * Math.PI / 180;
        }
      }

      // check http://www.movable-type.co.uk/scripts/latlong.html for more info
      var φ1 = origin.latitude.toRad();
      var φ2 = destination.latitude.toRad();
      var Δλ = (destination.longitude - origin.longitude).toRad();
      var R = 6371; // earth's radius, gives d in km
      var d = Math.acos(Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)) * R;
      return d;
    };

    var init = function() {
      $scope.geoMarker = new GeolocationMarker();
      $scope.geoMarker.setCircleOptions({fillColor: '#808080'});

      var centerPos = { lat: 12.7699298, lng: -122.4469157};
      directionDisplay = MapService.initMap('map', centerPos);


      google.maps.event.addListenerOnce($scope.geoMarker, 'position_changed', function () {
        var position = $scope.geoMarker.getPosition();
        console.dir(position);
        map.setCenter(position);
        map.fitBounds(this.getBounds());

        var destination = PathService.getCheckpointCoordinates(0);
        var origin = {'latitude': position.lat(), 'longitude': position.lng()};
//        MapService.traceRoute(directionDisplay, origin, destination);

        var pos = {'latitude': position.lat(), 'longitude': position.lng()};

        if (computeDistance(pos, path.checkpoints[0]) > 0.3) {
          MapService.traceRoute(directionDisplay, origin, destination);
        }
        else {
          console.log("you're arrived!");
          $scope.showMap=false;
          $scope.nextCheckpointNumber++;
          $scope.nextCheckpoint = path.checkpoints[$scope.nextCheckpointNumber];
          MapService.traceRoute(directionDisplay, pos, PathService.getCheckpointCoordinates($scope.nextCheckpointNumber));
        }

        google.maps.event.addListener($scope.geoMarker, 'position_changed', function () {
          var position = $scope.geoMarker.getPosition();
          map.setCenter(position);
          map.fitBounds(this.getBounds());

          var pos = {'latitude': position.lat(), 'longitude': position.lng()};
          if (computeDistance(pos, path.checkpoints[$scope.nextCheckpointNumber]) < 0.3) {
            console.log("you're arrived!");
            $scope.showMap=false;
            $scope.nextCheckpointNumber++;
            $scope.nextCheckpoint = path.checkpoints[$scope.nextCheckpointNumber];
            MapService.traceRoute(directionDisplay, pos, PathService.getCheckpointCoordinates($scope.nextCheckpointNumber));
          }
        });

      });
      $scope.geoMarker.setMap(map);

//      console.log('position geomarker');
//      console.dir(geoMarker.getPosition());
    };

    init();

    $scope.goToNextCheckpoint = function() {
      $scope.nextCheckpointNumber++;
      $scope.nextCheckpoint = path.checkpoints[$scope.nextCheckpointNumber];
      var position = $scope.geoMarker.getPosition();
      var pos = {'latitude': position.lat(), 'longitude': position.lng()};
      MapService.traceRoute(directionDisplay, pos, PathService.getCheckpointCoordinates($scope.nextCheckpointNumber));
    };









//    $scope.path = path;
//    var directionDisplay = null;
//    var GeoMarker = new GeolocationMarker();
//
//    var guideToCheckPoint = function(checkPointNumber) {
//      console.log('position');
//      console.dir($scope.position);
//      console.log('currentPosition');
//      $geolocation.getCurrentPosition().then(function(position) {
//        console.dir(position);
//        console.log('position watchPosition');
//        console.dir($scope.position);
//
//        var destination = PathService.getCheckpointCoordinates(checkPointNumber);
//        var origin = {"latitude": position.coords.latitude, "longitude": position.coords.longitude};
//        MapService.traceRoute(directionDisplay, origin, destination);
//      });
//    };
//
//    var init = function() {
//      $geolocation.getCurrentPosition().then(function(pos) {
//        $scope.position = pos;
//        $scope.origin = {"lat": pos.coords.latitude, "lng": pos.coords.longitude};
//      });
//      $scope.position = $geolocation.watchPosition({
//        timeout: 60000,
//        maximumAge: 250,
//        enableHighAccuracy: true
//      });
//
//      var position = null;
//      $geolocation.getCurrentPosition().then(function(pos) {
//        position = pos;
//
//        var centerPos = { lat: position.coords.latitude, lng: position.coords.longitude};
//        directionDisplay = MapService.initMap('map', centerPos);
//
//
//        google.maps.event.addListenerOnce(GeoMarker, 'position_changed', function () {
//          map.setCenter(this.getPosition());
//          map.fitBounds(this.getBounds());
//        });
//        GeoMarker.setMap(map);
//
//        guideToCheckPoint(0);
//      });
//
//      var i = 0;
//
////      while (1) {
////        if (position !== $scope.position) {
////          i++;
////          window.setTimeout('guideToCheckPoint(0, i)', 100000);
////          position = $scope.position;
////        }
////      }
//
//
//
////      PathService.getPath($stateParams.pathId).then(function (path) {
////        $scope.path = path;
////
////        $timeout(guideToCheckPoint(0), 10000);
////
////      });
//
//
//
//    };
//
//    init();













//    var init = function() {
//
//      /** Converts numeric degrees to radians */
//      if (typeof(Number.prototype.toRad) === "undefined") {
//        Number.prototype.toRad = function () {
//          return this * Math.PI / 180;
//        }
//      }
//
//      PathService.getPath($stateParams.pathId).then(function (path) {
//        $scope.path = path;
//
//        var watchPositionId = null;
//        //TODO: center map based on position
//        var centerPos = { lat: 37.7699298, lng: -122.4469157};
//        directionDisplay = MapService.initMap('map', centerPos);
//
//        GeoMarker = new GeolocationMarker();
//        GeoMarker.setCircleOptions({fillColor: '#808080'});
//
//        google.maps.event.addListenerOnce(GeoMarker, 'position_changed', function () {
//          map.setCenter(this.getPosition());
//          map.fitBounds(this.getBounds());
//        });
//        GeoMarker.setMap(map);
//
//        var computeRoadFromPositionToFirstCheckPoint = function () {
//          var arrived = false;
//          var i = 0;
//          var position;
//          while (!arrived && i < 10) {
//            i++;
//            console.log('just before testing if position.coords is undefined:');
//            position = $scope.position;
//            console.dir(position);
//            console.log('end position');
//            if (typeof(position.coords) != "undefined") {
//              console.log('position.coords was not undefined!');
//              var origin = {"latitude": $scope.position.coords.latitude, "longitude": $scope.position.coords.longitude};
//              var destination = {"latitude": path.checkpoints[0].latitude, "longitude": path.checkpoints[0].longitude};
//
//              // check http://www.movable-type.co.uk/scripts/latlong.html for more info
//              var φ1 = $scope.position.coords.latitude.toRad();
//              var φ2 = path.checkpoints[0].latitude.toRad();
//              var Δλ = (path.checkpoints[0].longitude - $scope.position.coords.longitude).toRad();
//              var R = 6371; // earth's radius, gives d in km
//              var d = Math.acos(Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)) * R;
//              if (d > 0.3) {
//                MapService.traceRoute(directionDisplay, origin, destination);
//              }
//              else {
//                arrived = true;
//                $geolocation.clearWatch(watchPositionId);
//              }
//            }
//          }
//        };
//
//        $geolocation.getCurrentPosition().then(function (pos) {
//          watchPositionId = $geolocation.watchPosition({
//            timeout: 60000,
//            maximumAge: 250,
//            enableHighAccuracy: true
//          });
//          $scope.position = $geolocation.position /*|| pos*/;
//          computeRoadFromPositionToFirstCheckPoint();
//
//        });
//
//        $scope.goToNextCheckpoint = function (position, nextCheckpoint) {
//          var computeRoadToNextCheckpoint = function (position) {
//            var coordinates = PathsService.getCheckpointCoordinates(nextCheckpoint);
//            var origin = {"latitude": position.lat(), "longitude": position.lng()};
//            MapService.traceRoute(directionDisplay, origin, coordinates);
//          };
//          var position = GeoMarker.getPosition();
//          if (position != null) {
//            computeRoadToNextCheckpoint(GeoMarker.getPosition());
//          } else {
//            $log.debug("position null");
//            alert("your browser doesn't support %GeoLocation");
//          }
//        };
//      });
//    }
//    init();
  })



  .controller('MapCtrl', function($scope, MapService) {
    var centerPos = { lat: 37.7699298,  lng: -122.4469157};
    var directionDisplay = MapService.initMap('map', centerPos);

    $scope.calcRoute = function() {
      var origin = {"latitude":37.7699298, "longitude": -122.4469157};
      var destination = {"latitude": 37.7683909618184, "longitude": -122.51089453697205};
      MapService.traceRoute(directionDisplay, origin, destination);
    }
  })

  .controller('AdminCtrl', function($scope, $log, $animate, PostService) {
    $scope.path = {
      'checkpoints' : []
    };
    $scope.searchBoxes = []; //list of the maps search Boxes autocomplete

    $scope.addCheckpoint = function() {
      var checkpoint ={
        name : ''
      };
      $scope.path.checkpoints.push(checkpoint);
      $scope.searchBoxes.push();
    }

    //will be executed when the ng repeat have finished being created
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
      var numCheckpoints = $scope.path.checkpoints.length - 1;
      $scope.searchBoxes[numCheckpoints] = new google.maps.places.Autocomplete(
        /** @type {HTMLInputElement} */(document.getElementById('autocomplete'+(numCheckpoints)))
      );
      //Listener calling a function when the user select one adress
      google.maps.event.addListener($scope.searchBoxes[numCheckpoints], 'place_changed', function() {
        retrieveLocation(numCheckpoints);
      });
    });

    //Post the path to the backend
    $scope.publishPath = function () {
      var pathJSON = angular.toJson($scope.path);
      PostService.postPath(pathJSON).then(function (status) {
        $log.debug("Path posted successfully");
        //TODO : create a new page and redirect to it
      });
    }

    retrieveLocation = function(numCheckpoint){
      var place = $scope.searchBoxes[numCheckpoint].getPlace();
      $scope.path.checkpoints[numCheckpoint].longitude = place.geometry.location.lng();
      $scope.path.checkpoints[numCheckpoint].latitude = place.geometry.location.lat();
    }
  });
