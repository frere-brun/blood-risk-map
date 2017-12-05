var loadingSteps = [
    "Chargement de l'application",
    "Récupération des données",
    "Création de la zone de danger"
];


$("#preloader-text").text(loadingSteps[0]);
// init slider and map

// bind click on map

// once finished
$("#preloader-text").text(loadingSteps[1]);
getData(null, function(){
  $("#preloader-wrapper").addClass("hidden");
  $("#app-wrapper").removeClass("hidden");
});


// interconnected stuff
function getData(year, cb) {
  var url = year ? "/getGeojsonFromYear/"+year : "/getGeojson";
  $.get(url, function(data, status){
    if (status !== 'success') {
      alert('An error has occured');
    } 
    else if (status === 'success') {
      // Extract geojson and display it as layers
      geojsonLayerSources = [];
      data.forEach(function(disease) {
        diseaseToGeojsonFeature(disease);
      });
      geojsonFeaturesToLayer();

      // Do some extra stuff if needed
      // ie: display map
      cb();
    }
    return status === "success"
  });
}