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


      PathsService.getPath('7858fd91-8ab8-4dde-9b9b-0763b8a9506d').then(function (path) {
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
    $scope.title = 'toto';
    var init = function() {
      PathsService.getPath('9dcfb9ec-4fea-44b1-9620-20dab6252660').then(function (path) {
        $scope.path = path;
        var centerPos = { lat: 37.7699298,  lng: -122.4469157};
        var directionDisplay = MapService.initMap('map', centerPos);

        var calcRoute = function(position) {
          console.dir(position);
          var origin = {"latitude":position.coords.latitude, "longitude": position.coords.longitude};
          var destination = {"latitude":path.checkpoints[0].latitude, "longitude": path.checkpoints[0].longitude};
          MapService.traceRoute(directionDisplay, origin, destination);
        };
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(calcRoute);
        } else {
          alert("your browser doesn't support %GeoLocation");
        }

//        calcRoute();
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
