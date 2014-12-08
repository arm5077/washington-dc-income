var countiesLayer,
	richer = "#122A62",
	poorer = "#7A8192";


function pickColor(income){
	console.log(income);
	return 	income > 100000 ? '#122A62' :
			income > 85000 ? '#263B6B' :
			income > 70000 ? '#3B4C75' :
			income > 55000 ? '#505E7E' :
			income > 40000 ? '#656F88' :
							'#7A8192';
			
}

function commaSeparateNumber(val){
	while (/(\d+)(\d{3})/.test(val.toString())){
		val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	return val;
}

$(window).load(function(){
	// Fix legend colors
	$(".header .legend .legendItem#richer .square").css("background-color", richer);
	$(".header .legend .legendItem#poorer .square").css("background-color", poorer);

	// Country-wide map
	var countryMap = new L.Map('countryMap', {
		center: [39.828328, -98.579416],
		zoom: 4,
		attributionControl: false,
		zoomControl:false
	});
	
	cartodb.createLayer(countryMap, "http://arm5077.cartodb.com/api/v2/viz/59d67b86-7ea5-11e4-aba4-0e018d66dc29/viz.json")
		.addTo(countryMap)
		.on('done', function(layer) {
			countiesLayer = layer
			income = 20000;
			layer.getSubLayer(0).set({
				cartocss: "#export { polygon-fill: " + richer + "; }"
			});
		}).on('error', function() {
			console.log("Whoooooops error.");
		});
	
	L.control.zoom( {
		position: "bottomright"
	}).addTo(countryMap);
	
	
	// DC-specific map
	var dcMap = new L.map('dcMap',{
		center: [38.907192,-77.036871],
		zoom:11,
		attributionControl: false,
		zoomControl: false
	});
	
	dcMap.addLayer(new L.StamenTileLayer("toner-lines", { opacity: .7 }))
	
	L.control.zoom( {
		position: "bottomright"
	}).addTo(dcMap);
	
	
	L.geoJson(dcTracts.features, {
		style: function(feature){ 
				return { 
					fillColor: pickColor(feature.properties["ACS_13_5_4"]),
					fillOpacity: .7,
					weight: 1,
					color: "white"
				} 
			},
		onEachFeature: function(feature, layer){
			var income = feature.properties["ACS_13_5_4"]
			layer.on({
				click: function(e){
					countiesLayer.getSubLayer(0).set({
						cartocss: " \
							#export [ median_income >= " + income + "] { polygon-fill: " + richer + "; } \
							#export { polygon-fill: " + poorer + "; } \
							"
							
					});
				},
				mousemove: function(e){
					console.log(e);
					$("#money").children("h1").html("$" + commaSeparateNumber(income))
					$("#money").children("h2").html(feature.properties.subhood)
					$("#money").addClass("show")
						.css({
							top: e.originalEvent.clientY - $("#money").outerHeight(),
							left: e.originalEvent.clientX - $("#money").outerWidth()
						})
					
				},
				mouseout: function(e){
					$("#money").removeClass("show");
				},
			});
		}
	}).addTo(dcMap);
});

