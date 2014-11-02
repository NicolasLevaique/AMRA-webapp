angular.module('starter.controllers', [])

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

  .controller('PlaylistsCtrl', function($scope) {
    $scope.playlists = [
      { title: 'path 1', pic : 'path1.jpg' , id: 1},
      { title: 'path 2', pic : 'path2.jpg' , id: 2},
      { title: 'path 3', pic : 'path3.jpg' , id: 3 },
      { title: 'Path 4', pic : 'path4.jpg' , id: 4 },
      { title: 'Path 5', pic : 'path5.jpg' , id: 5 },
      { title: 'Path 6', pic : 'path6.jpg' , id: 6 }
    ];
  })

 // .controller('PlaylistCtrl', function($scope, $stateParams) {
   //   //$scope.playlist = playlist;
    //})

   // .controller('PlaylistCtrl', function ($scope, $stateParams, PlaylistService) {
     // PlaylistService.findById($stateParams.playlistId).then(function(playlist) {
       // $scope.checkpoints = [
         // { title : 'checkpoint 1', pic : 'path1.jpg' , id: 1},
          //{ title : 'checkpoint 2', pic : 'path2.jpg' , id: 2}
        //]
        //$scope.playlist = playlist;
      //});
    //})

    .controller('PlaylistCtrl', function ($scope, $stateParams, PathsService, PlaylistService) {


      PathsService.getPath('fa74e5af-f581-4bee-8498-dc6f4d653c78').then(function (path) {
        $scope.path = path;
        $scope.checkpoints = path.checkpoints;
        $scope.title = "test";
      });

      PlaylistService.findById($stateParams.playlistId).then(function(playlist) {
        //$scope.checkpoints[0] =
        $scope.playlist = playlist;
      });
         })

  .controller('PathsCtrl', function($scope, PathsService, MapService) {
    var directionDisplay = null;
    var init = function() {
      /** Converts numeric degrees to radians */
      if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
          return this * Math.PI / 180;
        }
      }


      PathsService.getPath('fa74e5af-f581-4bee-8498-dc6f4d653c78').then(function (path) {
        $scope.path = path;
        var watchPositionId = null;
        //TODO: center map based on position
        var centerPos = { lat: 37.7699298,  lng: -122.4469157};
        directionDisplay = MapService.initMap('map', centerPos);

        var computeRoadFromPositionToFirstCheckPoint = function(position) {
          console.dir(position);
          var origin = {"latitude":position.coords.latitude, "longitude": position.coords.longitude};
          var destination = {"latitude":path.checkpoints[0].latitude, "longitude": path.checkpoints[0].longitude};

          // check http://www.movable-type.co.uk/scripts/latlong.html for more info
          var φ1 = position.coords.latitude.toRad();
          var φ2 = path.checkpoints[0].latitude.toRad();
          var Δλ = (path.checkpoints[0].longitude-position.coords.longitude).toRad();
          var R = 6371; // earth's radius, gives d in km
          var d = Math.acos( Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ) ) * R;
          if (d > 0.3) {
            MapService.traceRoute(directionDisplay, origin, destination);
          }
          else {
            navigator.geolocation.clearWatch(watchPositionId);
          }
        };
        if (navigator.geolocation) {
          var options = {enableHighAccuracy: true,timeout:2000};
          watchPositionId = navigator.geolocation.watchPosition(computeRoadFromPositionToFirstCheckPoint, null /*TODO: errorhandler ! */, options);
        } else {
          alert("your browser doesn't support %GeoLocation");
        }
      });
    };
    init();

    $scope.goToNextCheckpoint = function(position, nextCheckpoint) {
      var computeRoadToNextCheckpoint = function (position) {
        var coordinates = PathsService.getCheckpointCoordinates(nextCheckpoint);
        var origin = {"latitude": position.coords.latitude, "longitude": position.coords.longitude};
        MapService.traceRoute(directionDisplay, origin, coordinates);
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(computeRoadToNextCheckpoint);
      } else {
        alert("your browser doesn't support %GeoLocation");
      }
    };
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
