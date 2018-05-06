/*@written by John Musleh **/
var AzrieliMap = function(){
	var map=null;

	var current_floor = null;

	var marker_icon = L.icon({
		iconUrl: 'img/marker.png',
		iconSize: [30, 30],
		iconAnchor: [22, 94],
		popupAnchor: [-3, -76],
		shadowSize: [68, 95],
		shadowAnchor: [22, 94]
	});
	
	//options for tile layers [ISSUE : noWrap true gives me GET errors of invalid pictures]
	var tilelayer_options = {minZoom: 2, maxZoom:5, noWrap: false};
	//floor tile layers array 
	// 0 is floor-2, 1 is floor-1 etc..
	var layers = [L.tileLayer("maps/floor-2/{z}/{x}/{y}.png",tilelayer_options),
	 L.tileLayer("maps/floor-1/{z}/{x}/{y}.png",tilelayer_options),
	 L.tileLayer("maps/floor0/{z}/{x}/{y}.png",tilelayer_options),
	 L.tileLayer("maps/floor1/{z}/{x}/{y}.png",tilelayer_options),
	 L.tileLayer("maps/floor2/{z}/{x}/{y}.png",tilelayer_options),
	 L.tileLayer("maps/floor3/{z}/{x}/{y}.png",tilelayer_options), ]

	/*load_floor() : removes current floor tilelayer and loads the requested floor tilelayer
	*		default floor is -2*/
	var load_floor = function(f){
		if(typeof f != "number" || map==null || current_floor==f){
			console.log("f not a number or map is null or current floor is loaded");
			return;
		}
		if(f<-2 || f>3)
			f=-2;
		if(current_floor!=null)
			layers[current_floor+2].remove();
		layers[f+2].addTo(map);
		current_floor=f;
	}
	
	var mark = function(x,y){
		L.marker([x,y],{icon:marker_icon}).addTo(map);
	}
	var initModule = function(){
		//initiate the map and load floor 0
		bounds = L.latLngBounds([-80, -80], [80, 60]);
		map=L.map("map").setView([0,0],2);
		map.setMaxBounds(bounds);
		load_floor(0);
		
	};
	return { initModule: initModule,
			load_floor: load_floor,
			mark:mark};
}();
$(document).ready(function() {AzrieliMap.initModule();});

//ZOOM MARKER ISSUES :
//zoom level 3 -> (0,0)
//zoom level 2 -> (-4,1)
//zoom level 1 -> (-8,2)
//zoom level 0 -> (-20,3)