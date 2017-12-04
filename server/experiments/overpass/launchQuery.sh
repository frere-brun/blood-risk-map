touch overpassResult.json
cat query.query | query-overpass > overpassResult.json
#echo '[out:json];relation["name"="France"]["boundary"="administrative"];(._;>;);out;' | query-overpass > overpassResult.json
cat overpassResult.json
#mapshaper