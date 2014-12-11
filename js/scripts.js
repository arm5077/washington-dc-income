var countiesLayer,
	richer = "#FFEA32",
	poorer = "#5672b4",
	clickedTarget = false;
	//richer = "#122A62",
	//poorer = "#7A8192";


function getOpacity(income){
	return 	income > 63000 ? '.3' :
			income > 0 ? '.9' :
							'.9';
			
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
		minZoom:3,
		maxBounds: [[10.594189,-138.121094], [58.998256,-48.306641]],
		attributionControl: false,
		zoomControl:false
	});
	
	L.tileLayer('http://{s}.tiles.mapbox.com/v3/arm5077.kehf3hpe/{z}/{x}/{y}.png', {}
	).addTo(countryMap);
	
	countryMap.fitBounds([ [22.867318,-121.816406], [50.85568,-70.897461] ]);
	
	cartodb.createLayer(countryMap, "http://arm5077.cartodb.com/api/v2/viz/59d67b86-7ea5-11e4-aba4-0e018d66dc29/viz.json")
		.addTo(countryMap)
		.on('done', function(layer) {
			countiesLayer = layer
			income = 20000;
			layer.getSubLayer(0).set({
				cartocss: "#export [ median_income >= 67572] { polygon-opacity: 1; polygon-fill: " + richer + "; } \
							#export { polygon-opacity: 0; polygon-fill: " + poorer + "; }"
			});
			countiesLayer.on("loading", function(){
				$(".loader").addClass("show");
			})
			.on("load", function(){
				$(".loader").removeClass("show");
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
		minZoom: 10,
		maxBounds: [[38.75927,-77.167282],[39.063815,-76.858292]],
		attributionControl: false,
		zoomControl: false
	});
	
	
	L.tileLayer('http://{s}.tiles.mapbox.com/v3/arm5077.kei5c7hn/{z}/{x}/{y}.png', {}
	).addTo(dcMap);	
	
	dcMap.fitBounds([ [38.808597,-77.112694], [38.982281,-76.905152] ]);
	
	L.control.zoom( {
		position: "bottomright"
	}).addTo(dcMap);
	
	var geojson;
	geojson = L.geoJson(dcTracts.features, {
		style: function(feature){ 
				return { 
					//fillColor: pickColor(feature.properties["ACS_13_5_4"]),
					//fillColor: "#F7E438",
					//fillOpacity: getOpacity(feature.properties["ACS_13_5_4"]),
					color: "#F7E438",
					opacity: 0,
					weight: 3,
					dashArray: "5,5"
				} 
			},
		onEachFeature: function(feature, layer){
			var income = feature.properties["ACS_13_5_4"]
			layer.on({
				click: function(e){
					countiesLayer.getSubLayer(0).set({
						cartocss: " \
							#export [ median_income >= " + income + "] { polygon-opacity: 1; polygon-fill: " + richer + "; } \
							#export { polygon-opacity: 0; } \
							"
							
					}).on("done", function(){console.log("load");});
					if(clickedTarget) geojson.resetStyle(clickedTarget)
					clickedTarget = e.target;
					e.target.setStyle({
						opacity: .99,
						dashArray: "0"
					});
				},
				dblclick: function(e) {map.setView(e.latlng, dcMap.getZoom() + 1);},
				mousemove: function(e){
					if( e.target != clickedTarget ){
						e.target.setStyle({
							opacity: .99
						});
					}
					$("#money").children("h1").html("$" + commaSeparateNumber(income))
					$("#money").children("h2").html(feature.properties.WEB_URL)
					$("#money").addClass("show")
						.css({
							top: e.originalEvent.clientY - $("#money").outerHeight(),
							left: e.originalEvent.clientX - $("#money").outerWidth()
						})
					
				},
				mouseout: function(e){
					if( e.target != clickedTarget){
						geojson.resetStyle(e.target);
					}
					$("#money").removeClass("show");
				},
			});
		}
	}).addTo(dcMap);
});

