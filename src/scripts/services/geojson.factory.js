app.factory('Geojson', function($http) {

    var factory = {};

    factory.getData = function(){
        return $http.get('/getGeojson');
    };

    return factory;
});