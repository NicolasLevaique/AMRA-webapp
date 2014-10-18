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
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
  })

  .controller('PlaylistCtrl', function($scope, $stateParams) {
  })

  .controller('PathsCtrl', function($scope, PathsService, MapService) {
    $scope.title = 'toto';
    var init = function() {
      PathsService.getPath('fa74e5af-f581-4bee-8498-dc6f4d653c78').then(function (path) {
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
