var countiesLayer;

$(window).load(function(){

	// Country-wide map
	var countryMap = new L.Map('countryMap', {
		center: [39.828328, -98.579416],
		zoom: 4
	});
		
	cartodb.createLayer(countryMap, "http://arm5077.cartodb.com/api/v2/viz/467b386c-7d59-11e4-9dfa-0e9d821ea90d/viz.json")
		.addTo(countryMap)
		.on('done', function(layer) {
			countiesLayer = layer
			income = 20000;
			layer.getSubLayer(0).set({
				cartocss: "#export { polygon-fill: #AA8E39; }"
			});
		}).on('error', function() {
			console.log("Whoooooops error.");
		});
	
	// DC-specific map
	var dcMap = new L.map('dcMap',{
		center: [38.907192,-77.036871],
		zoom:11,
		attributionControl: false,
		zoomControl: false
	});
	
	//dcMap.addLayer(new L.StamenTileLayer("toner-lines", { opacity: .5 }))
	
	L.geoJson(dcTracts, {
		style: {
			"weight": 1
		},
		onEachFeature: function(feature, layer){
			layer.on({
				click: function(e){
					income = feature.properties["ACS_13_5YR_S1903_with_ann_Median income (dollars); Estimate; Households"];
					console.log(income);
					countiesLayer.getSubLayer(0).set({
						cartocss: " \
							#export [ acs_13_5_4 >= " + income + "] { polygon-fill: #122A62; } \
							#export { polygon-fill: #7A8192; } \
							"
							
					});
				}
			});
		}
	}).addTo(dcMap);
});