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

.controller('PathsCtrl', function($scope, PathsService) {
    $scope.title = 'toto';
    console.log('test');
  PathsService.getPath('ed294220-4d3f-11e4-916c-0800200c9a66').then(function(path) {
    $scope.title = path.title;
  });
})

.controller('MapCtrl', function($scope, MapService) {
    console.log('test');
        var centerPos = { lat: 37.7699298,  lng: -122.4469157};
        var directionDisplay = MapService.initMap('map', centerPos);

        $scope.calcRoute = function() {
            var origin = new google.maps.LatLng(37.7699298, -122.4469157);
            var destination = new google.maps.LatLng(37.7683909618184, -122.51089453697205);
            MapService.traceRoute(directionDisplay, origin,destination);
        }
});
