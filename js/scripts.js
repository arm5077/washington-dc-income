$(window).load(function(){

	var countryMap = new L.Map('countryMap', {
		center: [39.828328, -98.579416],
		zoom: 4
	})
		
	cartodb.createLayer(countryMap, "http://arm5077.cartodb.com/api/v2/viz/467b386c-7d59-11e4-9dfa-0e9d821ea90d/viz.json")
		.addTo(countryMap)
		.on('done', function(layer) {
			income = 20000;
			layer.getSubLayer(0).set({
				cartocss: "#export [ acs_13_5_4 >= " + income + "] { polygon-fill: #B10026; }"
			});
		}).on('error', function() {
		//log the error
		});
});