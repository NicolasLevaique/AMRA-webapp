/**
 * Created by Nicolas on 06/10/2014.
 */

angular.module('starter.services', [])

  .service('PathsService', ['$http', '$q', function($http, $q) {
    return {
      getPath: function (pathId) {
        var deferred = $q.defer();
        //ed294220-4d3f-11e4-916c-0800200c9a66
        $http.get('http://localhost:8200/api/paths/' + pathId).success(function (path) {
          deferred.resolve(path);
        }).error(function (err, status) {
          deferred.reject(status);
        });
        return deferred.promise;
      }
    }
  }])

    .service('MapService', ['$http', '$q', function($q) {
        return {
            traceRoute: function (directionsDisplay, origin, destination) {
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
                    });
                },
            initMap : function(id,centerPos) {
                var directionsService = new google.maps.DirectionsService();
                var directionsDisplay;

                directionsDisplay = new google.maps.DirectionsRenderer();
                var mapOptions = {
                    center: centerPos,
                    zoom: 8
                };
                map = new google.maps.Map(document.getElementById(id),
                    mapOptions);
                directionsDisplay.setMap(map);
                return directionsDisplay;
            }
            }
    }]);
