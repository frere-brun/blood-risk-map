app.controller('homeCtrl', function ($location, geojsonProvider, optionsProvider, $window, $rootScope, $document, $state, $scope, $timeout, $http, NgMap) {

    // Initilization
    // =============================

    $scope.options = optionsProvider.data;
    var polygons = [];
    var geojson = geojsonProvider.data;

    setStyleToData(geojson);
    
    polygons = geojsonToPolygons(google, geojson);

    $scope.activeMarkers = [];
    $scope.isMobile = false;

    $scope.result = "";
    $scope.search = "";

    $scope.rangeData = 6;
    var year = $scope.currentYear = 2016;
    $scope.details = null;
    $scope.autocompleteOptions = "";
    $scope.featuresCollections = [];


    var setAdmissibilityData = function() {
        var response = isMarkerInBounds(google, $scope.marker, polygons, geojson, $scope.currentYear);
        $scope.isAdmissible = response.isAdmissible;
        $scope.deseases = response.data;
        console.log($scope.deseases);
    }

    var addMarker = function(latLng) {
        $scope.marker = {position:{lat: latLng.lat(),lng: latLng.lng()}};
        console.log({lat: latLng.lat(),lng: latLng.lng()});
        $scope.$apply();
    }

    // SearchBar
    // =============================

    // Au moment ou une lettre est ajoutée à la recherche
    // on ajoute ou enlève le reset filtre
    // et on met à jour les markers
    // =============================
    $scope.$watch('result', function(oldValue, newValue) {
        if (newValue !== oldValue) {
            if($scope.details)
            {
                var location = $scope.details.geometry.location;
                $scope.marker = {
                    name:"bla",
                    position: {
                        lat: location.lat(),
                        lng: location.lng(),
                    }
                };
                setAdmissibilityData();
            }
        }
    });

    $scope.$watch('marker', function(oldValue, newValue) {
      if (newValue !== oldValue) 
        setAdmissibilityData();
    });

    $scope.$watch('rangeData', function(oldValue, newValue) {
      if (newValue !== oldValue) {
        $scope.currentYear = year - 6 + parseInt($scope.rangeData);
        
        $scope.featuresCollections = updateGeojson($scope.map, geojson, $scope.featuresCollections, $scope.currentYear);
        
        $scope.map.data.addListener('click', function(event) {
            addMarker(event.latLng);
        });

        $timeout(function(){
            setAdmissibilityData();
        },1000)
      }
    });

    // Reset complet du filtre recherche
    // =============================

    $scope.removeResult = function() {

        $timeout(function(){
            $(".remove-research-button").removeClass("visible");
        }, 300);

        $scope.search = "";
        $scope.result = "";
        $scope.details = null;
        $scope.marker = null;
    }

    $scope.$watch('search', function() {
        if ($scope.search != "")
            $(".remove-research-button").addClass("visible");
        else
            $(".remove-research-button").removeClass("visible");
    });

    // Map
    // =============================



    // Initialisation de la map
    // =============================
    NgMap.getMap().then(function(map) {

        $scope.map = map;
        $rootScope.isMapLoaded = true;

        map.data.setStyle($scope.options.gmap.overlay.style);

        $scope.bounds = new google.maps.LatLngBounds();
        
        $scope.featuresCollections = addGeojson(map, geojson, $scope.currentYear);
        setStyleToMap(map);

        map.data.addListener('click', function(event) {
            addMarker(event.latLng);
        });
        google.maps.event.addListener(map, 'click', function(event) {
            addMarker(event.latLng);
        });
    });

    // En cas de idle
    //
    // On reset les filtres
    // referme le panel
    // et enfin reset la map à leurs états initiaux
    // =============================

    var resetAll = function() {
        resetMap($scope.map, $rootScope.isMapLoaded, $scope.options.gmap, $scope.isMobile);
        $scope.removeResult();
    }

    $rootScope.$on('idle::idle', function() {
        resetAll();
    });

    // On detecte si on est sur un mobile
    // =============================
    var isMobile = function() {
        if ($(document).width() <= 1000)
            $scope.isMobile = true;
        else
            $scope.isMobile = false;
    }

    // On debounce la fonction de reset de la map
    // =============================
    var handleResize = debounce(function(){
        resetMap($scope.map, $rootScope.isMapLoaded, $scope.options.gmap, $scope.isMobile);
    }, 600);

    var isKeyboardOpen = false;

    $rootScope.$on('keyboardOpen::keyboardOpen', function() {
        console.log("keyboardOpening");
        isKeyboardOpen = true;
    });

    $rootScope.$on('keyboardClose::keyboardClose', function() {
        console.log("keyboardClosing");
        isKeyboardOpen = false;
    });

    // Quand on reçoit un signal de resize
    // =============================
    $rootScope.$on('resize::resize', function() {
        isMobile();
        if (!isKeyboardOpen)
            handleResize();
    });

});

