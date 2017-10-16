app.factory('Options', function($http) {

    var factory = {};

    factory.getData = function(){
        return $http.get('../ressources/options.json');
    };

    return factory;
});