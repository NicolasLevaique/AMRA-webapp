/**
 * Created by Nicolas on 06/10/2014.
 */

angular.module('starter.services', [])

  .service('Environment', [function() {
    return {
      //if dev
      backend: 'http://localhost:8200/api/'
      // if prod
//      backend: 'http://3ma7.learning-socle.org/'
    }
  }])



  .service('PathService', ['$http', '$q', 'Environment', function($http, $q, Environment) {
    var currentPath = null;
    return {
      getPath: function (pathId) {
        var deferred = $q.defer();
        $http.get(Environment.backend + 'paths/' + pathId).success(function (path) {
          currentPath = path;
          deferred.resolve(path);
        }).error(function (err, status) {
          deferred.reject(status);
        });
        return deferred.promise;
      },
      getCheckpointCoordinates: function (checkpoint) {
        console.dir(currentPath.checkpoints[checkpoint]);
        return {"latitude":currentPath.checkpoints[checkpoint].latitude, "longitude": currentPath.checkpoints[checkpoint].longitude}
      }
    }
  }])

  .service('PostService', ['$http', '$q', 'Environment', function($http, $q, Environment) {
    return {
      postPath: function (jsonPath) {
        var deferred = $q.defer();
        //ed294220-4d3f-11e4-916c-0800200c9a66
        $http.post(Environment.backend + "paths", jsonPath)
          .success(function (status) {
            deferred.resolve();
          }).error(function (err, status) {
            deferred.reject(status);
          });
        return deferred.promise;
      }
    }
  }])

  .service('PathsService', ['$http', '$q', 'Environment', function($http, $q, Environment) {
    return {
      getSuggestedPaths: function (position, distance) {
        var deferred = $q.defer();
        console.dir(position);
        $http.get(Environment.backend + 'paths/?lat=' + position.coords.latitude +
          '&long=' + position.coords.longitude + '&dist=' + distance).success(function (paths) {
          deferred.resolve(paths);
        }).error(function (err, status) {
          deferred.reject(status);
        });
        return deferred.promise;
      }
    }
  }])

  .service('MapService', ['$http', '$q', function() {
    return {
      traceRoute: function (directionsDisplay, originJSON, destinationJSON) {
        var origin = new google.maps.LatLng(originJSON.latitude, originJSON.longitude);
        var destination = new google.maps.LatLng(destinationJSON.latitude, destinationJSON.longitude);
        var directionsService = new google.maps.DirectionsService();
        var request = {
          origin:origin,
          destination:destination,
          travelMode: google.maps.TravelMode.WALKING
        };
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
          else {
            console.dir(request);
            console.log("error with google map : " + status);
          }
        });
      },
      initMap : function(id,centerPos) {
        var directionsDisplay;

        directionsDisplay = new google.maps.DirectionsRenderer();
        var mapOptions = {
          center: centerPos,
          zoom: 15
        };
        map = new google.maps.Map(document.getElementById(id),
          mapOptions);
        directionsDisplay.setMap(map);
        return directionsDisplay;
      }
    }
  }]);
