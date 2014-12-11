/**
 * Created by Nicolas on 06/10/2014.
 */

angular.module('starter.services', [])

  .service('Environment', [function() {
    return {
      //if dev
      backend: 'http://localhost:8200/api/'
      // if prod
      //backend: 'http://3ma7.learning-socle.org/'
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

.service('UserService', ['$http', '$q', 'Environment', function($http, $q, Environment) {
        var User = {
            isConnected: false,
            username: ''
        };
        return {
            User : User
        }
    }])




.service('FBService', ['$http', '$q', 'UserService', function($http, $q, UserService) {
    return {

        getLoginStatus : function(callbackFunction) {
            console.log("calling FB.getLoginStatus");
            FB.getLoginStatus(callbackFunction);
            console.log("After calling FB.getLoginStatus");

        },
        getUserInfos : function() {
            var deferred = $q.defer();
            FB.api('/me', function (response) {
                console.log(JSON.stringify(response));
                /*
                 {"id":"10205998707993947","first_name":"Thomas","gender":"male","last_name":"Vuillemin",
                 "link":"https://www.facebook.com/app_scoped_user_id/10205998707993947/",
                 "locale":"en_US","name":"Thomas Vuillemin","timezone":1,"updated_time":"2014-06-11T11:34:11+0000","verified":true}
                 */
                UserService.User.isLogged = true;
                UserService.User.name = response.name;
                UserService.User.id = response.id;
                UserService.User.isConnected = true;

                deferred.resolve();
            });
            return deferred.promise;

        },
        login : function(callbackFunction) {
            FB.login(callbackFunction);
        },
        watchLoginChange : function () {
            facebook.FB.Event.subscribe('auth.authResponseChange', function(response) {

                if (response.status === 'connected') {

                    /*
                     The user is already logged,
                     is possible retrieve his personal info
                     */
                    _self.getUserInfo();

                    /*
                     This is also the point where you should create a
                     session for the current user.
                     For this purpose you can use the data inside the
                     response.authResponse object.
                     */

                }
                else {

                    /*
                     The user is not logged to the app, or into Facebook:
                     destroy the session on the server.
                     */

                };
                console.log("lala");
            })
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
