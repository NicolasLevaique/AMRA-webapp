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

    .service('MapService', ['$http', '$q', function($http, $q) {
        return {
            getMap: function () {
                    var mapOptions = {
                        zoom: 8,
                        center: new google.maps.LatLng(-34.397, 150.644)
                    };
            }
        }
    }]);
