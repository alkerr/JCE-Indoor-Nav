/*~written by John Musleh~
------------------------------------------------------------------------------
 The AzrieliMap module is a graphical interactive map of the college campus  |
 The module uses leafletJS library in order to represent the map and features|
------------------------------------------------------------------------------

Features:
---------
	-Multi floor maps, the map represents 1 floor at a time , the function load_floor() is used to switch between floors
	-Navigation path, the map draws a navigation path when given a set of valid way points
*/
var AzrieliMap = function(){
	// ---------------------------------- [VARIABLES] -----------------------------------------------------------
	var map=null; //map object
	var current_floor = null; //current floor (integer)
	
	var marker_icon = L.icon({ //icon object for the markers
		iconUrl: 'img/marker.png',
		iconSize: [60, 60],
		iconAnchor: [22, 94],
		popupAnchor: [-3, -76],
		shadowSize: [68, 95],
		shadowAnchor: [22, 94]
	});
	
	var markers = []; //array of {obj:_ , coord:[_,_], floor:_} objects where obj is the leaflet marker object, coord is max zoom coordinates  and floor is floor number
	
	var tilelayer_options = {minZoom: 2, maxZoom:5, noWrap: false};//options object for tile layers
	
	//floor tile layers array 
	// 0 is floor-2, 1 is floor-1 etc..
	var layers = [L.tileLayer("maps/floor-2/{z}/{x}/{y}.png",tilelayer_options),
	 L.tileLayer("maps/floor-1/{z}/{x}/{y}.png",tilelayer_options),
	 L.tileLayer("maps/floor0/{z}/{x}/{y}.png",tilelayer_options),
	 L.tileLayer("maps/floor1/{z}/{x}/{y}.png",tilelayer_options),
	 L.tileLayer("maps/floor2/{z}/{x}/{y}.png",tilelayer_options),
	 L.tileLayer("maps/floor3/{z}/{x}/{y}.png",tilelayer_options), ]

	 
	 
	//---------------------------------- [FUNCTIONS] -----------------------------------------------------------
	
	/*load_floor() : (default floor is -2)
		removes current floor tilelayer
		loads the requested floor tilelayer
		loads all markers for the floor and removes all other markers
	*/
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
		
		//removing all previous markers and loading new markers for the floor
		var i;
		for(i=0;i<markers.length;i++){
			if(markers[i].floor == current_floor)
				markers[i].obj.addTo(map);
			else
				markers[i].obj.remove();
			
		}
	}
	
	
	/* mark(): draws a marker and adds it to the markers[] array*/
	var mark = function(x,y,floor){
		if(arguments.length != 3 || typeof x != "number" || typeof y != "number" || typeof floor != "number" || map == null){
			console.log("mark() arguments error");
			return;
		}
		map.setView([x,y],5)
		var marker = L.marker([x,y],{icon:marker_icon});
		markers[markers.length] = {obj:marker,coord:[x,y],floor:floor}
		if(current_floor == floor)
			marker.addTo(map);
		
	}
	
	
	/*update_markers(): updates markers[] array coordinates according to zoom level*/
	var update_markers = function(){
		if(map == null)
			return;
		var delta_x, delta_y;
		if(map._zoom == 5){
			delta_x = 0;
			delta_y = 0;
		}
			
		else if(map._zoom == 4){
			delta_x = -2;
			delta_y = 0;
		}

		else if(map._zoom == 3){
			delta_x = -4;
			delta_y = -1;
		}
		
		else if(map._zoom == 2){
			delta_x = -10;
			delta_y = -2;
		}
		var i;
		for(i=0; i<markers.length; i++){
			var x = markers[i].coord[0];
			var y = markers[i].coord[1];
			var floor = markers[i].floor;
			var new_marker = L.marker([x+delta_x, y+delta_y],{icon:marker_icon});
			markers[i].obj.remove();
			markers[i] = {obj:new_marker,coord:[x,y],floor:floor}
			if(current_floor == floor)
				new_marker.addTo(map);
		}
		
	}
	
	
	/* initModule():
		initiate map object and load floor 0
		[MISSING] mark all destinations for every floor
	*/
	var initModule = function(){

		var bounds = L.latLngBounds([-80, -80], [80, 60]);
		map=L.map("map").setView([0,0],2);
		map.setMaxBounds(bounds);
		load_floor(0);
		map.on('zoomend', update_markers);
	};
	
	/* debug function */
	var print_markers=  function(){
		console.log(markers);
		console.log(map);
		
	}
	
	
	return { initModule: initModule,
			load_floor: load_floor,
			mark:mark,
			print_markers:print_markers};
}();
$(document).ready(function() {AzrieliMap.initModule();});

//get map zoom level -> map._zoom
//map.on("zoomend", func) -> detects when zoom level changes
//change marker coordinates -> MARKER.obj.setLatLng([10,10]); 
//get marker coordinates -> MARKER.obj._latlng.lat OR .lng

//[DRAW PATH ISSUE]
// DRAW(X,Y) DRAWS (X-3,Y) INSTEAD OF (X,Y)