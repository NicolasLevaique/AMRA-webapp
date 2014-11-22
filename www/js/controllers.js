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

  .controller('PathsCtrl', function($scope, $log, PathsService, MapService) {
    var directionDisplay = null;
    var GeoMarker;
    var init = function() {
      PathsService.getPath('dd2f9822-3a64-47ef-8595-942fd9c86162').then(function (path) {
        $scope.path = path;
        //TODO: center map based on position
        var centerPos = { lat: 37.7699298,  lng: -122.4469157};
        directionDisplay = MapService.initMap('map', centerPos);
        //Displaying the position on the maps
          //To access the position, use GeoMarker.getPosition();
         GeoMarker = new GeolocationMarker();
          GeoMarker.setCircleOptions({fillColor: '#808080'});

          google.maps.event.addListenerOnce(GeoMarker, 'position_changed', function() {
              map.setCenter(this.getPosition());
              map.fitBounds(this.getBounds());
          });
         GeoMarker.setMap(map);

        var computeRoadFromPositionToFirstCheckPoint = function(position) {
          console.dir(position);
          var origin = {"latitude":position.coords.latitude, "longitude": position.coords.longitude};
          var destination = {"latitude":path.checkpoints[0].latitude, "longitude": path.checkpoints[0].longitude};
          MapService.traceRoute(directionDisplay, origin, destination);
        };
        if (navigator.geolocation) {
          var options = {enableHighAccuracy: true,timeout:2000};
          navigator.geolocation.getCurrentPosition(computeRoadFromPositionToFirstCheckPoint, null /*TODO: errorhandler ! */, options);
        } else {
          alert("your browser doesn't support %GeoLocation");
        }

//        calcRoute();
      });
    };
        init();

        $scope.goToNextCheckpoint = function(position, nextCheckpoint) {
      var computeRoadToNextCheckpoint = function (position) {
        var coordinates = PathsService.getCheckpointCoordinates(nextCheckpoint);
        var origin = {"latitude": position.lat(), "longitude": position.lng()};
        MapService.traceRoute(directionDisplay, origin, coordinates);
      };
      var position = GeoMarker.getPosition();
      if (position != null) {
         computeRoadToNextCheckpoint(GeoMarker.getPosition());
      } else {
          $log.debug("position null");
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
