/*
------------------------------------------------------------------------------
 The AzrieliMap module is a graphical interactive map of the college campus  |
 The module uses leafletJS library in order to represent the map and features|
------------------------------------------------------------------------------
~written by John Musleh~
Features:
---------
	-Multi floor maps, the map represents 1 floor at a time , the function load_floor() is used to switch between floors
	-Destinations available marked on each floor
	-Navigation path, the map draws a navigation path when given a set of valid way points through multi floor using the method draw_path()
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

	/* mark(): draws a marker and adds it to the markers[] array*/
	var mflag = 0; //set to 1 when zoomed in to add the markers - this flag is used to zoom back out to previous zoom in update_markers
	var prev_zoom = 2;// holds the previous zoom when adding a marker
	var mark = function(x,y,floor){
		if(arguments.length != 3 || typeof x != "number" || typeof y != "number" || typeof floor != "number" || map == null){
			console.log("mark() arguments error");
			return;
		}
		prev_zoom = map._zoom;
		map.setView([x,y],5);
		mflag =1;
		var marker = L.marker([x,y],{icon:marker_icon});
		markers[markers.length] = {obj:marker,coord:[x,y],floor:floor}
		if(current_floor == floor)
			marker.addTo(map);
	}
	

	/*update_markers(): updates markers[] array coordinates according to zoom level*/
	var update_markers = function(){
		if(map == null)
			return;
		if(mflag == 1){
			map.setZoom(prev_zoom);
			mflag = 0;
		}
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
			var tmp_x = delta_x;
			if(x<=-45 || x>=60){
				if(map._zoom == 2)
					tmp_x+=5;
				else if(map._zoom == 3)
					tmp_x+=2;
				else if(map._zoom == 4)
					tmp_x+=1;
			}
			
			var new_marker = L.marker([x+tmp_x, y+delta_y],{icon:marker_icon});
			markers[i].obj.remove();
			markers[i] = {obj:new_marker,coord:[x,y],floor:floor}
			if(current_floor == floor)
				new_marker.addTo(map);
		}
	}
	
	
	/* initModule():
		initiate map object and load floor 0
		mark all destinations for every floor
		[MISSING] get user location and set view to user location
	*/
	var initModule = function(){
		var bounds = L.latLngBounds([-80, -80], [80, 60]);
		map=L.map("map").setView([0,0],2);
		map.setMaxBounds(bounds);
		load_floor(0);
		map.on('zoomend', update_markers);
		
		
		destinations = { //example and testing
					"floorm2":[
						{"name":"C-201","coord":[-65,-5],"closest_waypoint":{"id":13,"x":-65,"y":-5,"z":-2,"adj":{"id":14,"dist":3}}, "hours":null, "services":[null]}
					],
					"floorm1":[
						{"name":"C-101","coord":[-65,-5],"closest_waypoint":{"id":13,"x":-65,"y":-5,"z":-1,"adj":{"id":14,"dist":3}}, "hours":null, "services":[null]}
					],
					"floor0":[
						{"name":"Student Services","coord":[-63,-10],"closest_waypoint":{"id":2,"x":-63,"y":-10,"z":0,"adj":{"id":14,"dist":3}}, "hours":"null", "services":[null]}
					],
					"floor1":[
						{"name":"C105","coord":[-63,-10],"closest_waypoint":{"id":2,"x":-63,"y":-10,"z":1,"adj":{"id":14,"dist":3}}, "hours":null, "services":[null]}
					],
					"floor2":[
						{"name":"C205","coord":[-61.5,-5],"closest_waypoint":{"id":2,"x":-63,"y":-10,"z":2,"adj":{"id":14,"dist":3}}, "hours":null, "services":[null]}
					],
					"floor3":[
						{"name":"Study Room","coord":[-63,-10],"closest_waypoint":{"id":2,"x":-63,"y":-10,"z":3,"adj":{"id":14,"dist":3}}, "hours":null, "services":[null]}
					]
				}
		updateDestinations(destinations);
	};
	
	
	/* updateDestinations():
		marks every destination on the map from the JSON object*/
	var updateDestinations = function(JSON_DATA){
		if(arguments.length != 1 || map == null)
			return;
		var i;
		for(i=0; i<JSON_DATA.floorm2.length; i++){
			mark(JSON_DATA.floorm2[i].coord[0],JSON_DATA.floorm2[i].coord[1],-2);
		}
		for(i=0; i<JSON_DATA.floorm1.length; i++){
			mark(JSON_DATA.floorm1[i].coord[0],JSON_DATA.floorm1[i].coord[1],-1);
		}
		for(i=0; i<JSON_DATA.floor0.length; i++){
			mark(JSON_DATA.floor0[i].coord[0],JSON_DATA.floor0[i].coord[1],0);
		}
		for(i=0; i<JSON_DATA.floor1.length; i++){
			mark(JSON_DATA.floor1[i].coord[0],JSON_DATA.floor1[i].coord[1],1);
		}
		for(i=0; i<JSON_DATA.floor2.length; i++){
			mark(JSON_DATA.floor2[i].coord[0],JSON_DATA.floor2[i].coord[1],2);
		}
		for(i=0; i<JSON_DATA.floor3.length; i++){
			mark(JSON_DATA.floor3[i].coord[0],JSON_DATA.floor3[i].coord[1],3);
		}
	}
	
	
	/* update_path:
		removes current path and draws path according to current floor if it exists in the path coordinates arrays*/
	var floorm2_path = []; //holds path coordinates for floor -2
	var floorm1_path = []; //holds path coordinates for floor -1
	var floor0_path = []; //holds path coordinates for floor 0
	var floor1_path = []; //holds path coordinates for floor 1
	var floor2_path = []; //holds path coordinates for floor 2
	var floor3_path = []; //holds path coordinates for floor 3
	var polyline = null; //object to hold polyline , can only have 1 each floor
	var update_path = function(){
		if(polyline!=null)
			polyline.remove();
		if(current_floor==-2 && floorm2_path.length>0){
			polyline = L.polyline(floorm2_path, {color: 'red',weight:10}).addTo(map);
			map.fitBounds(polyline.getBounds());
		}
		else if(current_floor==-1 && floorm1_path.length>0){
			polyline = L.polyline(floorm1_path, {color: 'red',weight:10}).addTo(map);
			map.fitBounds(polyline.getBounds());
		}
		else if(current_floor==0 && floor0_path.length>0){
			console.log("drawing for floor 0 with weight 10");
			polyline = L.polyline(floor0_path, {color: 'red',weight:10}).addTo(map);
			map.fitBounds(polyline.getBounds());
		}
		else if(current_floor==1 && floor1_path.length>0){
			polyline = L.polyline(floor1_path, {color: 'red',weight:10}).addTo(map);
			map.fitBounds(polyline.getBounds());
		}
		else if(current_floor==2 && floor2_path.length>0){
			polyline = L.polyline(floor2_path, {color: 'red',weight:10}).addTo(map);
			map.fitBounds(polyline.getBounds());
		}
		else if(current_floor==3 && floor3_path.length>0){
			polyline = L.polyline(floor3_path, {color: 'red',weight:10}).addTo(map);
			map.fitBounds(polyline.getBounds());
		}
	}
	
	
	/* draw_path(): 
		fills in path coordinates for the given waypoints for each floor then calls update_path() which draws the path for the current floor(expects to be given an array of waypoints [{x,y,z}])*/
	var draw_path = function(path){
		if(map==null || arguments.length != 1)
			return;
		//resetting previous path
		floorm2_path=[];
		floorm1_path=[];
		floor0_path=[];
		floor1_path=[];
		floor2_path=[];
		floor3_path=[];
		var i;
		for(i=0; i<path.length; i++){
			if(path[i].z == -2)
				floorm2_path[floorm2_path.length] = [(path[i].x)+2,(path[i].y)+0.5];
			else if(path[i].z == -1)
				floorm1_path[floorm1_path.length] = [(path[i].x)+2,(path[i].y)+0.5];
			else if(path[i].z == 0)
				floor0_path[floor0_path.length] = [(path[i].x)+2,(path[i].y)+0.5];
			else if(path[i].z == 1)
				floor1_path[floor1_path.length] = [(path[i].x)+2,(path[i].y)+0.5];
			else if(path[i].z == 2)
				floor2_path[floor2_path.length] = [(path[i].x)+2,(path[i].y)+0.5];
			else if(path[i].z == 3)
				floor3_path[floor3_path.length] = [(path[i].x)+2,(path[i].y)+0.5];
		}
		
		update_path();
	}

	
	/*load_floor() : (default floor is -2)
		removes current floor tilelayer
		loads the requested floor tilelayer
		loads all markers for the floor and removes all other markers
		if a path exists , removes current polyline and updates path via update_path()
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
		
		//update_path if it exists
		if(polyline!=null)
			update_path();
		
	}
	
	/* debug function */
	var print_markers=  function(){
		console.log(markers);
	}
	
	return { initModule: initModule,
			load_floor: load_floor,
			mark:mark,
			print_markers:print_markers,
			draw_path:draw_path};
}();
$(document).ready(function() {AzrieliMap.initModule();});

//get map zoom level -> map._zoom
//map.on("zoomend", func) -> detects when zoom level changes
//change marker coordinates -> MARKER.obj.setLatLng([10,10]); 
//get marker coordinates -> MARKER.obj._latlng.lat OR .lng

//[DRAW PATH ISSUE]
// DRAW(X,Y) DRAWS (X-3,Y) INSTEAD OF (X,Y)