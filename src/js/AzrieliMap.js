var routingService = function(){
	function makeNavGraph(graph){
		var temp={};
		for(var i=0;i<graph.length;i++){
			temp[(graph[i].id+"")]=graph[i].adj;
		}
		return temp;
	}
	
	function getNode(graph,id){
		for(var i=0;i<graph.length;i++){
			if(""+graph[i].id===""+id)
				return graph[i];	
		}
		console.log("node not found: "+id);
		return {};	
	}
	
	function getRouteToDest(startId, destId) {
		var waypoint=data["waypoints"];
		var navgraph=makeNavGraph(waypoint);		
		var  graph = new Graph(navgraph);		
		var shortPathIndesx=graph.findShortestPath(startId, destId);	

		var pathXYZ=[];
		for(var i=0;i<shortPathIndesx.length;i++){
			var curNode=getNode(waypoint,shortPathIndesx[i]);
			pathXYZ.push({"x":curNode.x,"y":curNode.y,"z":curNode.z})

		}	
		return pathXYZ;	
	}
	return { getRouteToDest: getRouteToDest};
}();


var circle = null;//circle object to be drawn on the location , this object is used in other modules to get current location coords
var GeoService = function () {

	function getTileURL(lat, lon, zoom=8) {
		var xtile = parseInt(Math.floor( (lon + 180) / 360 * (1<<zoom) ));
		var ytile = parseInt(Math.floor( (1 - Math.log(Math.tan(lat* Math.PI / 180) + 1 / Math.cos(lat* Math.PI / 180)) / Math.PI) / 2 * (1<<zoom) ));
		return {"x":xtile,"y":ytile};
	}
	
	function getClosestIndex(lat, lng,curFloor=current_floor,graph=data.waypoints) {
		var clickedPx=map.project({"lat":lat,"lng":lng},5);
		var minDist=-1,minIndex;
		for(var i=0;i<graph.length;i++){
			if(graph[i].z!=curFloor){
				continue;			
			}
			var curPx=map.project({"lat":graph[i].x,"lng":graph[i].y},5);
			
			var xdif = curPx.x - clickedPx.x;
			var ydif = curPx.y - clickedPx.y;
			var distsq=xdif * xdif + ydif * ydif;
			var distance=Math.sqrt(distsq);
			
			if(minDist==-1||distance<minDist){
				minDist=distance;
				minIndex=graph[i].id;
			}
		}
		return minIndex;
	}
	function getClosestNode(lat, lng,curFloor=current_floor,graph=data.waypoints) {
		return GraphMaker.getNode(graph,getClosestIndex(lat, lng,curFloor,graph));
	}
	
	function getDistance(lat, lng,node,curFloor=current_floor) {
		if(node.z!=curFloor){
			return 10000;	//map is 8192 pxels long		
			console.log("diffrent floor");
		}
		var clickedPx=map.project({"lat":lat,"lng":lng},5);
		var curPx=map.project({"lat":node.x,"lng":node.y},5);
		
		var xdif = curPx.x - clickedPx.x;
		var ydif = curPx.y - clickedPx.y;
		var distsq=xdif * xdif + ydif * ydif;
		var distance=Math.sqrt(distsq);
		
		return distance;
	}
	
	


	var rotDegree=0;
	var mapDistortion=null;	
	function calcMapDistortion(){

		var topCollege=map.project({"lat":71.552741,"lng":28.652344},5);
		var bottomCollege=map.project({"lat":-55.329144,"lng":-36.386719},5);	
		var topGps =map.project({"lat":31.769834,"lng":35.194080},18);
		var btmGps=map.project({"lat":31.768456,"lng":35.193439},18);
		
		var newTop=rotate(4096,4096,topCollege.x,topCollege.y,rotDegree);
		var newBtm=rotate(4096,4096,bottomCollege.x,bottomCollege.y,rotDegree);

		var xfactor=(newTop[0]-newBtm[0])/(topGps.x-btmGps.x);
		var yfactor=(newTop[1]-newBtm[1])/(topGps.y-btmGps.y);
		
		var centerx=topGps.x-((4743-4096)/xfactor);
		var centery=topGps.y-((1729-4096)/yfactor);
		
		mapDistortion={"xFactor":xfactor,"yFactor":yfactor,"centerX":centerx,"centerY":centery};
	
	}
	
	
	//offsets stairs outsiede
	//{"waypoints":[{"id":1,"x":3.6888551431470478,"y":25.488281250000004,"z":0,"adj":{"2":5.774783946559172}},{"id":2,"x":5.834616165610059,"y":30.849609375000004,"z":1,"adj":{"1":5.774783946559172,"3":9.260702836361869}},{"id":3,"x":8.320212289522944,"y":39.77050781250001,"z":2,"adj":{"2":9.260702836361869,"4":5.041118279117637}},{"id":4,"x":6.620957270326323,"y":35.02441406250001,"z":3,"adj":{"3":5.041118279117637,"5":9.619990790860623}},{"id":5,"x":5.353521355337334,"y":25.488281250000004,"z":-1,"adj":{"4":9.619990790860623,"6":2.3653255993520763}},{"id":6,"x":4.477856485570586,"y":23.291015625000004,"z":-2,"adj":{"5":2.3653255993520763}}]}
	
	//offset  stairs inside
	//{"waypoints":[{"id":1,"x":-70.78690984117928,"y":-3.9550781250000004,"z":-2,"adj":{"2":3.211786775961042}},{"id":2,"x":-69.50376519563684,"y":-1.0107421875000002,"z":-1,"adj":{"1":3.211786775961042,"3":1.0596185785393852}},{"id":3,"x":-68.75231494434473,"y":-0.26367187500000006,"z":0,"adj":{"2":1.0596185785393852,"4":6.01724164432596}},{"id":4,"x":-67.15289820820027,"y":5.537109375000001,"z":1,"adj":{"3":6.01724164432596,"5":8.265137517084996}},{"id":5,"x":-67.39059859150741,"y":13.798828125000002,"z":2,"adj":{"4":8.265137517084996,"6":4.9980827785379}},{"id":6,"x":-68.47992564291268,"y":8.920898437500002,"z":3,"adj":{"5":4.9980827785379}}]}
	
	
	//elevator
	//{"waypoints":[{"id":1,"x":12.254127737657381,"y":-3.6914062500000004,"z":-2,"adj":{"2":2.886826277146298}},{"id":2,"x":13.32548488559795,"y":-1.0107421875000002,"z":-1,"adj":{"1":2.886826277146298,"3":2.1216127144039914}},{"id":3,"x":11.43695521614319,"y":-0.0439453125,"z":0,"adj":{"2":2.1216127144039914,"4":6.087409567047312}},{"id":4,"x":13.539200668930816,"y":5.6689453125,"z":1,"adj":{"3":6.087409567047312,"5":8.567292823145692}},{"id":5,"x":15.961329081596647,"y":13.886718750000002,"z":2,"adj":{"4":8.567292823145692,"6":5.224967866395595}},{"id":6,"x":14.477234210156519,"y":8.876953125000002,"z":3,"adj":{"5":5.224967866395595}}]}

	//main entrance 
	//{"waypoints":[{"id":1,"x":73.47848507889992,"y":26.674804687500004,"z":-2,"adj":{"2":1.9224363786602319}},{"id":2,"x":73.12494524712693,"y":28.564453125000004,"z":-1,"adj":{"1":1.9224363786602319,"3":1.5861153407433761}},{"id":3,"x":71.53882990638355,"y":28.564453125000004,"z":0,"adj":{"2":1.5861153407433761,"4":5.450648426516857}},{"id":4,"x":71.66366293141732,"y":34.01367187500001,"z":1,"adj":{"3":5.450648426516857,"5":9.056793740084862}},{"id":5,"x":73.22669969306126,"y":42.93457031250001,"z":2,"adj":{"4":9.056793740084862,"6":4.614887941703598}},{"id":6,"x":73.15043991163012,"y":38.3203125,"z":3,"adj":{"5":4.614887941703598}}]}
	var floorOffset=[];
	var floorScale=[];
	function calcFloorOffset(){
	floorScale=[];
	floorOffset=[];
		var commonNodes=[{"id":1,"x":12.254127737657381,"y":-3.6914062500000004,"z":-2,"adj":{"2":2.886826277146298}},{"id":2,"x":13.32548488559795,"y":-1.0107421875000002,"z":-1,"adj":{"1":2.886826277146298,"3":2.1216127144039914}},{"id":3,"x":11.43695521614319,"y":-0.0439453125,"z":0,"adj":{"2":2.1216127144039914,"4":6.087409567047312}},{"id":4,"x":13.539200668930816,"y":5.6689453125,"z":1,"adj":{"3":6.087409567047312,"5":8.567292823145692}},{"id":5,"x":15.961329081596647,"y":13.886718750000002,"z":2,"adj":{"4":8.567292823145692,"6":5.224967866395595}},{"id":6,"x":14.477234210156519,"y":8.876953125000002,"z":3,"adj":{"5":5.224967866395595}}];
		

		var center =map.project({"lat":commonNodes[2].x,"lng":commonNodes[2].y},5);
		 

	commonNodes2=[{"id":1,"x":73.47848507889992,"y":26.674804687500004,"z":-2,"adj":{"2":1.9224363786602319}},{"id":2,"x":73.12494524712693,"y":28.564453125000004,"z":-1,"adj":{"1":1.9224363786602319,"3":1.5861153407433761}},{"id":3,"x":71.53882990638355,"y":28.564453125000004,"z":0,"adj":{"2":1.5861153407433761,"4":5.450648426516857}},{"id":4,"x":71.66366293141732,"y":34.01367187500001,"z":1,"adj":{"3":5.450648426516857,"5":9.056793740084862}},{"id":5,"x":73.22669969306126,"y":42.93457031250001,"z":2,"adj":{"4":9.056793740084862,"6":4.614887941703598}},{"id":6,"x":73.15043991163012,"y":38.3203125,"z":3,"adj":{"5":4.614887941703598}}];
	
		var center2 =map.project({"lat":commonNodes2[2].x,"lng":commonNodes2[2].y},5);
		for(var i=0;i<6;i++){
			var current= map.project({"lat":commonNodes[i].x,"lng":commonNodes[i].y},5);
			var current2= map.project({"lat":commonNodes2[i].x,"lng":commonNodes2[i].y},5);
			floorScale.push([(current2.x-current.x)/(center2.x-center.x)
			,(current2.y-current.y)/(center2.y-center.y)]);
			
		}
		
		for(var i=0;i<6;i++){
			var current= map.project({"lat":commonNodes[i].x,"lng":commonNodes[i].y},5);
			floorOffset.push([(center.x-current.x)/floorScale[i][0],(center.y-current.y)/floorScale[i][1]]);
			
		}
		
	
	}
	

	function gpsToMap(lat,lng,floor){

		if(mapDistortion==null){
			 calcMapDistortion();
			 calcFloorOffset();
		}
		
		var temp=map.project({"lat":lat,"lng":lng},18);

		temp.x-=mapDistortion.centerX;
		temp.y-=mapDistortion.centerY;
		
		temp.x*=mapDistortion.xFactor;
		temp.y*=mapDistortion.yFactor;
		
		temp.x*=floorScale[floor+2][0];
		temp.y*=floorScale[floor+2][1];
		temp.x-=floorOffset[floor+2][0];
		temp.y-=floorOffset[floor+2][1];
		
		temp.x+=4096;
		temp.y+=4096;
		

		
		
		var rot=rotate(4743,1729,temp.x,temp.y,-rotDegree);
		temp.x=rot[0];
		temp.y=rot[1];
		

		var coods=map.unproject(temp, 5);

		return coods;
		
	}
	var  group2 = L.layerGroup();
	var prvLat=null,prvLng=null;
	function drawUser(lat=null,lng=null,current_floor,radius=4){
	
		if(lat==null||lng==null){
			if(prvLat==null||prvLng==null)
				return;
			else{
				lat=prvLat;
				lng=prvLng;
			}
		}
		prvLat=lat;
		prvLng=lng;
		
		group2.clearLayers();
		coods=gpsToMap(lat,lng,current_floor);
        
		var scale2=Math.abs(Math.cos(coods.lat*Math.PI/180));
		radius*=50000;
		
		circle=L.circle(coods, {color: 'red',"radius": radius*scale2,opacity:0.5}).bindTooltip("your location");
        console.log(circle);
		group2.addLayer(circle);
		
		group2.addTo(map);

	}
	

function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}


	return {
		gpsToMap:gpsToMap,
		getClosestNode:getClosestNode,
		getClosestIndex:getClosestIndex,
		drawUser:drawUser
	}

}();




/** used to translate the marker descriptions */
var translate = function(lang,str){
    var obj = null;
    if(lang == 'en'){
        obj = english;
    }
    else if(lang == 'ar'){
        obj = arabic;
    }
    else if(lang == 'hb'){
        obj = hebrew;
    }
    return obj[str];
}

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
    -Location , the map uses the GeoService module and draws a circle of the user location
*/
var map=null; //map object
var AzrieliMap = function(){
	// ---------------------------------- [VARIABLES] -----------------------------------------------------------
	
	var current_floor = null; //current floor (integer)
	var tooltip= null;
    var lang = 'en';
	
	var location_circle = null;
    
	var marker_icon5 = null;
    var marker_icon4 = null;
    var marker_icon3 = null;
    var marker_icon2 = null;
	
    
    var tooltip_icon = L.icon({ //icon object for the markers
		iconUrl: 'img/tooltip.png',
		iconSize: [0, 0],
		iconAnchor: [22, 94],
		popupAnchor: [-3, -76],
		shadowSize: [68, 95],
		shadowAnchor: [22, 94]
	});
    
	var markers = []; //array of {obj:_ , coord:[_,_], floor:_} objects where obj is the leaflet marker object, coord is max zoom coordinates  and floor is floor number
	
	var tilelayer_options = {minZoom: 2, maxZoom:5, noWrap: false};//options object for tile layers
    
	
	//floor tile layers array 
	// 0 is floor-2, 1 is floor-1 etc..
	var layers = null;

    var invalid_location_layer = L.tileLayer("img/invalid.jpg",{minZoom: 2, maxZoom:5});
    var invalid_location_f = false;

	//---------------------------------- [FUNCTIONS] -----------------------------------------------------------
    
    var change_lang = function(l){
        if(l == 'en')
            lang = l;
        else if(l == 'ar')
            lang = l;
        else if(l == 'hb')
            lang = l;
    }
    
    var on_mark_click = function(e){
        var marker = e.target;
        if (tooltip!=null && L.stamp(e.originalEvent.target) === L.stamp(tooltip._container)) {
            var destination_id = GeoService.getClosestIndex(marker._latlng.lat ,marker._latlng.lng, current_floor );
            var current_location_id =1;
            if(circle != null)
                current_location_id = GeoService.getClosestIndex(circle._latlng.lat,circle._latlng.lng,current_floor);
            if(marker.options.closest_wp != null){
                var dest_id = marker.options.closest_wp;
                AzrieliMap.navigate(current_location_id,dest_id,marker.options.title);
            }
            else{
                AzrieliMap.navigate(current_location_id,destination_id,marker.options.title);
            }
            AzrieliMap.follow_mode_on();
        } 
        else{
            if(tooltip != null)
                tooltip.remove();
            
            var txt = translate(lang,marker.options.title);
            var content = txt+'<br>click to navigate';
            tooltip = L.tooltip({permanent: true,interactive:true,opacity:0.8},marker).setLatLng([e.latlng.lat,e.latlng.lng]).setContent(content).addTo(map);
            marker.bindTooltip(tooltip);
        }
    }
    
    
	/* mark(): draws a marker and adds it to the markers[] array*/
	var mark = function(x,y,floor,title,closest_wp){
		if(arguments.length != 5 || typeof x != "number" || typeof y != "number" || typeof floor != "number" || typeof title != "string" || map == null ){
			return;
		}
        if(invalid_location_f == true)
            return;
		//map.setView([x,y],5);
        
		var marker = L.marker([x,y],{icon:marker_icon5,title:title,closest_wp:closest_wp});
        marker.on("click",on_mark_click);
		markers[markers.length] = {obj:marker,coord:[x,y],floor:floor,title:title,closest_wp:closest_wp}
		if(current_floor == floor){
			marker.addTo(map);
		}
	}
	

	/*update_markers(): updates markers[] array coordinates according to zoom level*/
	var update_markers = function(){
		if(map == null || invalid_location_f==true)
			return;

        for(i=0; i<markers.length; i++){
			var x = markers[i].coord[0];
			var y = markers[i].coord[1];
			var title = markers[i].title;
			var floor = markers[i].floor;
            var closest_wp = markers[i].closest_wp;
            
            if(map._zoom == 5){
                var new_marker = L.marker([x, y],{icon:marker_icon5,title:title,closest_wp:closest_wp});
                new_marker.on("click",on_mark_click);
                markers[i].obj.remove();
                markers[i] = {obj:new_marker,coord:[x,y],floor:floor,title:title,closest_wp:closest_wp}

                if(current_floor == floor){
                    new_marker.addTo(map);
                }
            }
            else if(map._zoom == 4){
                var new_marker = L.marker([x, y],{icon:marker_icon4,title:title,closest_wp:closest_wp});
                new_marker.on("click",on_mark_click);
                markers[i].obj.remove();
                markers[i] = {obj:new_marker,coord:[x,y],floor:floor,title:title,closest_wp:closest_wp}

                if(current_floor == floor){
                    new_marker.addTo(map);
                }
			
            }
            else if(map._zoom == 3){
                var new_marker = L.marker([x, y],{icon:marker_icon3,title:title,closest_wp:closest_wp});
                new_marker.on("click",on_mark_click);
                markers[i].obj.remove();
                markers[i] = {obj:new_marker,coord:[x,y],floor:floor,title:title,closest_wp:closest_wp}

                if(current_floor == floor){
                    new_marker.addTo(map);
                }
			
            }
            else if(map._zoom == 2){
                var new_marker = L.marker([x, y],{icon:marker_icon2,title:title,closest_wp:closest_wp});
                new_marker.on("click",on_mark_click);
                markers[i].obj.remove();
                markers[i] = {obj:new_marker,coord:[x,y],floor:floor,title:title,closest_wp:closest_wp}

                if(current_floor == floor){
                    new_marker.addTo(map);
                }
			
            }
			
			
        }
        /*
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
			var title = markers[i].title;
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
			
			var new_marker = L.marker([x+tmp_x, y+delta_y],{icon:marker_icon,title:title});
            new_marker.on("click",on_mark_click);
			markers[i].obj.remove();
			markers[i] = {obj:new_marker,coord:[x,y],floor:floor,title:title}
			
			if(current_floor == floor){
				new_marker.addTo(map);
			}
        }
        */
	}
	
	
	/* initModule():
		initiate map object and load floor 0
		mark all destinations for every floor
		[MISSING] get user location and set view to user location
	*/
    var follow_mode = true;
    var unfollow_mode_function = null;
	var initModule = function(l){
        if(marker_icon5 == null){
            marker_icon5 = L.icon({ //icon object for the markers
                iconUrl: 'img/marker.png',
                iconSize: [60, 60]
           });
        }
        if(marker_icon4 == null){
            marker_icon4 = L.icon({ //icon object for the markers
                iconUrl: 'img/marker.png',
                iconSize: [50, 50]
           });
            
        }
        if(marker_icon3 == null){
            marker_icon3 = L.icon({ //icon object for the markers
                iconUrl: 'img/marker.png',
                iconSize: [40, 40]
           });
        }
        if(marker_icon2 == null){
            marker_icon2 = L.icon({ //icon object for the markers
                iconUrl: 'img/marker.png',
                iconSize: [30, 30]
           });
            
        }
        
        if(layers == null){
            layers = [L.tileLayer("maps/floor-2/{z}/{x}/{y}.png",tilelayer_options),
            L.tileLayer("maps/floor-1/{z}/{x}/{y}.png",tilelayer_options),
            L.tileLayer("maps/floor0/{z}/{x}/{y}.png",tilelayer_options),
            L.tileLayer("maps/floor1/{z}/{x}/{y}.png",tilelayer_options),
            L.tileLayer("maps/floor2/{z}/{x}/{y}.png",tilelayer_options),
            L.tileLayer("maps/floor3/{z}/{x}/{y}.png",tilelayer_options), ];
        }
        
        $("#map_wrap").prepend('<div id = "map" style="height:85%;background:#888888; margin:0;"></div>');
        lang = l;
		var bounds = L.latLngBounds([-80, -80], [80, 80]);
		map=L.map("map",{attributionControl: false});
		map.setMaxBounds(bounds);
		load_floor(0);
       
		map.on('zoomend', update_markers);
		updateDestinations(destinations);
        
        map.on("click",function(e){
            if(tooltip!=null){
                tooltip.remove();
                tooltip = null;
            }
        });
        
        watch_location();
        
        map.on("drag", function () {
            if(unfollow_mode_function!=null){
                unfollow_mode_function();
            }
            follow_mode = false;
        });
        
  
       
	};
	
	
	/* updateDestinations():
		marks every destination on the map from the JSON object*/
	var updateDestinations = function(JSON_DATA){
		if(arguments.length != 1 || map == null || invalid_location_f==true)
			return;
        
        map.setView([0,0],5);
		var i;
		for(i=0; i<JSON_DATA.floorm2.length; i++){
			mark(JSON_DATA.floorm2[i].coord[0],JSON_DATA.floorm2[i].coord[1],-2,JSON_DATA.floorm2[i].name,JSON_DATA.floorm2[i].closest_waypoint);
		}
		for(i=0; i<JSON_DATA.floorm1.length; i++){
			mark(JSON_DATA.floorm1[i].coord[0],JSON_DATA.floorm1[i].coord[1],-1,JSON_DATA.floorm1[i].name,JSON_DATA.floorm1[i].closest_waypoint);
		}
		for(i=0; i<JSON_DATA.floor0.length; i++){
			mark(JSON_DATA.floor0[i].coord[0],JSON_DATA.floor0[i].coord[1],0,JSON_DATA.floor0[i].name,JSON_DATA.floor0[i].closest_waypoint);
		}
		for(i=0; i<JSON_DATA.floor1.length; i++){
			mark(JSON_DATA.floor1[i].coord[0],JSON_DATA.floor1[i].coord[1],1,JSON_DATA.floor1[i].name,JSON_DATA.floor1[i].closest_waypoint);
		}
		for(i=0; i<JSON_DATA.floor2.length; i++){
			mark(JSON_DATA.floor2[i].coord[0],JSON_DATA.floor2[i].coord[1],2,JSON_DATA.floor2[i].name,JSON_DATA.floor2[i].closest_waypoint);
		}
		for(i=0; i<JSON_DATA.floor3.length; i++){
			mark(JSON_DATA.floor3[i].coord[0],JSON_DATA.floor3[i].coord[1],3,JSON_DATA.floor3[i].name,JSON_DATA.floor3[i].closest_waypoint);
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
	var update_path = function(prev_floor){
        if(invalid_location_f == true)
            return;
		//remove all current polylines from prev_floor
		var i;
		if(prev_floor == -2){
			for(i=0; i<floorm2_path.length; i++)
				if(floorm2_path[i].polyline != null)
					floorm2_path[i].polyline.remove();
		}
		else if(prev_floor == -1){
			for(i=0; i<floorm1_path.length; i++)
				if(floorm1_path[i].polyline != null)
					floorm1_path[i].polyline.remove();
		}
		else if(prev_floor == 0){
			for(i=0; i<floor0_path.length; i++)
				if(floor0_path[i].polyline != null)
					floor0_path[i].polyline.remove();
		}
		else if(prev_floor == 1){
			for(i=0; i<floor1_path.length; i++)
				if(floor1_path[i].polyline != null)
					floor1_path[i].polyline.remove();
		}
		else if(prev_floor == 2){
			for(i=0; i<floor2_path.length; i++)
				if(floor2_path[i].polyline != null)
					floor2_path[i].polyline.remove();
		}
		else if(prev_floor == 3){
			for(i=0; i<floor3_path.length; i++)
				if(floor3_path[i].polyline != null)
					floor3_path[i].polyline.remove();
		}
		
		//drawing polyline paths for the current floor
		if(current_floor==-2 && floorm2_path.length>0){
			for(i=0; i<floorm2_path.length;i++){
				floorm2_path[i].polyline = L.polyline(floorm2_path[i].path, {color: 'red',weight:10}).addTo(map);
			}
		}
		else if(current_floor==-1 && floorm1_path.length>0){
			for(i=0; i<floorm1_path.length;i++){
				floorm1_path[i].polyline = L.polyline(floorm1_path[i].path, {color: 'red',weight:10}).addTo(map);
			}
		}
		else if(current_floor==0 && floor0_path.length>0){
			for(i=0; i<floor0_path.length;i++){
				floor0_path[i].polyline = L.polyline(floor0_path[i].path, {color: 'red',weight:10}).addTo(map);
			}
		}
		else if(current_floor==1 && floor1_path.length>0){
			for(i=0; i<floor1_path.length;i++){
				floor1_path[i].polyline = L.polyline(floor1_path[i].path, {color: 'red',weight:10}).addTo(map);
			}
		}
		else if(current_floor==2 && floor2_path.length>0){
			for(i=0; i<floor2_path.length;i++){
				floor2_path[i].polyline = L.polyline(floor2_path[i].path, {color: 'red',weight:10}).addTo(map);
			}
		}
		else if(current_floor==3 && floor3_path.length>0){
			for(i=0; i<floor3_path.length;i++){
				floor3_path[i].polyline = L.polyline(floor3_path[i].path, {color: 'red',weight:10}).addTo(map);
			}
		}
	}
	
	
	/* draw_path(): 
		fills in path coordinates for the given waypoints for each floor then calls update_path() which draws the path for the current floor(expects to be given an array of waypoints [{x,y,z}])*/
	var draw_path = function(path){
		if(map==null || arguments.length != 1 || invalid_location_f==true)
			return;
		//resetting previous path
		for(i=0; i<floorm2_path.length; i++)
			if(floorm2_path[i].polyline != null)
				floorm2_path[i].polyline.remove();
			
		for(i=0; i<floorm1_path.length; i++)
			if(floorm1_path[i].polyline != null)
				floorm1_path[i].polyline.remove();
			
		for(i=0; i<floor0_path.length; i++)
			if(floor0_path[i].polyline != null)
				floor0_path[i].polyline.remove();
			
		for(i=0; i<floor1_path.length; i++)
			if(floor1_path[i].polyline != null)
				floor1_path[i].polyline.remove();
			
		for(i=0; i<floor2_path.length; i++)
			if(floor2_path[i].polyline != null)
				floor2_path[i].polyline.remove();
			
		for(i=0; i<floor3_path.length; i++)
			if(floor3_path[i].polyline != null)
				floor3_path[i].polyline.remove();
			
		floorm2_path=[]; //array of objects {path:[[x,y]], polyine: polyline object or null}
		floorm1_path=[];
		floor0_path=[];
		floor1_path=[];
		floor2_path=[];
		floor3_path=[];
		var new_path_flag = 1;
		var i;
		for(i=0; i<path.length; i++){
			if(i>0 && path[i].z != path[i-1].z)
				new_path_flag = 1;

			if(path[i].z == -2){
				if(new_path_flag ==1){
					floorm2_path[floorm2_path.length] = {path:[ [(path[i].x),(path[i].y)] ], polyline:null};
					new_path_flag = 0;
				}
				else{
					if(floorm2_path.length > 0 ){
						floorm2_path[floorm2_path.length-1].path[floorm2_path[floorm2_path.length-1].path.length] = [(path[i].x),(path[i].y)];
					}
					else{
						floorm2_path[0].path[floorm2_path[0].path.length] = [(path[i].x),(path[i].y)];
					}
				}
			}
			
			else if(path[i].z == -1){
				if(new_path_flag ==1){
					floorm1_path[floorm1_path.length] = {path:[ [(path[i].x),(path[i].y)] ], polyline:null};
					new_path_flag = 0;
				}
				else{
					if(floorm1_path.length > 0 ){
						floorm1_path[floorm1_path.length-1].path[floorm1_path[floorm1_path.length-1].path.length] = [(path[i].x),(path[i].y)];
					}
					else{
						floorm1_path[0].path[floorm1_path[0].path.length] = [(path[i].x),(path[i].y)];
					}
				}
			}
			
			else if(path[i].z == 0){
				if(new_path_flag ==1){
					floor0_path[floor0_path.length] = {path:[ [(path[i].x),(path[i].y)] ], polyline:null};
					new_path_flag = 0;
				}
				else{
					if(floor0_path.length > 0 ){
						floor0_path[floor0_path.length-1].path[floor0_path[floor0_path.length-1].path.length] = [(path[i].x),(path[i].y)];
					}
					else{
						floor0_path[0].path[floor0_path[0].path.length] = [(path[i].x),(path[i].y)];
					}
				}
			}
			
			else if(path[i].z == 1){
				if(new_path_flag ==1){
					floor1_path[floor1_path.length] = {path:[ [(path[i].x),(path[i].y)] ], polyline:null};
					new_path_flag = 0;
				}
				else{
					if(floor1_path.length > 0 ){
						floor1_path[floor1_path.length-1].path[floor1_path[floor1_path.length-1].path.length] = [(path[i].x),(path[i].y)];
					}
					else{
						floor1_path[0].path[floor1_path[0].path.length] = [(path[i].x),(path[i].y)];
					}
				}
			}
			
			else if(path[i].z == 2){
				if(new_path_flag ==1){
					floor2_path[floor2_path.length] = {path:[ [(path[i].x),(path[i].y)] ], polyline:null};
					new_path_flag = 0;
				}
				else{
					if(floor2_path.length > 0 ){
						floor2_path[floor2_path.length-1].path[floor2_path[floor2_path.length-1].path.length] = [(path[i].x),(path[i].y)];
					}
					else{
						floor2_path[0].path[floor2_path[0].path.length] = [(path[i].x),(path[i].y)];
					}
				}
			}
			else if(path[i].z == 3){
				if(new_path_flag ==1){
					floor3_path[floor3_path.length] = {path:[ [(path[i].x),(path[i].y)] ], polyline:null};
					new_path_flag = 0;
				}
				else{
					if(floor3_path.length > 0 ){
						floor3_path[floor3_path.length-1].path[floor3_path[floor3_path.length-1].path.length] = [(path[i].x),(path[i].y)];
					}
					else{
						floor3_path[0].path[floor3_path[0].path.length] = [(path[i].x),(path[i].y)];
					}
				}
			}
		}
		update_path(current_floor);
	}

    
    var up = function(){
        if(current_floor<3)
            load_floor(current_floor+1);
    }
    
    var down = function(){
        if(current_floor>-2)
            load_floor(current_floor-1);
    }
	
	/*load_floor() : (default floor is -2)
		removes current floor tilelayer
		loads the requested floor tilelayer
		loads all markers for the floor and removes all other markers
		if a path exists , removes current polyline and updates path via update_path()
	*/
	var load_floor = function(f){
		if(typeof f != "number" || map==null || invalid_location_f==true || isNaN(f)){
            console.log("error loading");
			return;
		}
        if(tooltip != null)
            tooltip.remove();
		if(f<-2 || f>3)
			f=-2;
		var prev_floor = -2;
		if(current_floor!=null){
			layers[current_floor+2].remove();
			prev_floor = current_floor;
		}
		layers[f+2].addTo(map);
		
        current_floor=f;
        $("#floor").html(current_floor);
		//removing all previous markers and loading new markers for the floor
		var i;
		for(i=0;i<markers.length;i++){
			if(markers[i].floor == current_floor){
				markers[i].obj.addTo(map);
				//markers[i].obj.bindPopup(markers[i].title).openPopup();
				
			}
			else
				markers[i].obj.remove();
			
		}
		if(progress_path!=null)
            progress_path.remove();
		update_path(prev_floor);
        update_instructions();
		
	};
	
	
	/*navigate(): calls draw_path() and builds instruction array for each floor then calls update_instructions() */
    //expects from and to way points id's 
    //when from or to are negative values , cancels all paths
    var path = null;
    var on_navigate = null; //a function given the title as a string
    var instructions = []; //array of {instruction:"", body:"", coords:[x,y], floor:"", tooltip:obj,marker:obj}\
    var navigation_active = false;
    var navigate = function(from, to,title){
        if(invalid_location_f== true)
            return;
        
        
        //removing old instructions
        var i;
        for(i=0; i<instructions.length; i++){
            if(instructions[i].tooltip != null)
                instructions[i].tooltip.remove();
            if(instructions[i].marker != null)
                instructions[i].marker.remove();
        }
        instructions = [];
        if(from <0 || to<0){
            draw_path([]);
            navigation_active = false;
            if(on_navigate != null)
                on_navigate(null); //to notify nav is canceled
            if(progress_path!=null)
                progress_path.remove()
            return;
        }
        path = routingService.getRouteToDest(from,to);
        draw_path(path);
        
        for(i=0; i<path.length-1; i++){
            if( path[i].z != path[i+1].z ){
                var instruction;
                if(path[i].z < path[i+1].z){
                    instruction = "Up";
                    var body = "";
                    var j = i+1;
                    while(j<path.length-1){
                        if(path[j].z < path[j+1].z)
                            j++
                        else
                            break;
                    }
                    if(j<path.length){
                        instruction+=" to floor";
                        body = " "+path[j].z+"<br>click";
                    }
                }
                else{
                    instruction = "Down";
                    var j = i+1;
                    while(j<path.length-1){
                        if(path[j].z > path[j+1].z)
                            j++
                        else
                            break;
                    }
                    if(j<path.length){
                        instruction+=" to floor";
                        body = " "+path[j].z+"<br>click";
                    }
                }
                
                instructions[instructions.length] = {instruction:instruction,body:body,coords:[path[i].x,path[i].y] ,floor:path[i].z,tooltip:null,marker:null};
            }
        }
        instructions[instructions.length] = {instruction:"Destination",body:"!",coords:[path[i].x,path[i].y] ,floor:path[i].z,tooltip:null,marker:null};
        update_instructions();
        if(on_navigate != null)
            on_navigate(title);
        navigation_active=true;
    };
    
    var on_instruction_click = function(e){
        var i;
        for(i=0; i<instructions.length; i++){
            tp = instructions[i].tooltip;
            if (tp!=null && L.stamp(e.originalEvent.target) === L.stamp(tp._container)) {
                //MISSING CHECK IF USER LOCATION IS IN RANGE
                if(instructions[i].instruction.includes("Up") ){
                    load_floor(current_floor+1);
                }
                else if(instructions[i].instruction.includes("Down") ){
                   load_floor(current_floor-1);
                }
            }
        }
    }
    
    var update_instructions = function(){
        var i;
        //removing old instructions
        for(i=0; i<instructions.length; i++){
            if(instructions[i].tooltip != null)
                instructions[i].tooltip.remove();
            if(instructions[i].marker != null)
                instructions[i].marker.remove();
        }
        
        for(i=0; i<instructions.length; i++){
            if(instructions[i].floor == current_floor){
                var marker = L.marker(instructions[i].coords,{icon:tooltip_icon}).addTo(map);
                var content = "";
                if(lang == 'en'){
                    content = english[instructions[i].instruction]
                }
                else if(lang == 'ar'){
                    content = arabic[instructions[i].instruction]
                }
                else if(lang == 'hb'){
                    content = hebrew[instructions[i].instruction]
                }
                content+= instructions[i].body;
                var tp =L.tooltip({permanent:true,interactive:true},marker).setLatLng(instructions[i].coords).setContent(content).addTo(map);
                marker.on("click",on_instruction_click);
                marker.bindTooltip(tp);
                instructions[i].tooltip = tp;
                instructions[i].marker = marker;
            }
                
        }
        
    }
    
    /*update_path_progress(): draws path of current user progress depending on his location */
    var update_path_progress = function(wp_index){
        var arr = data['waypoints'];
        var i,x,y;
        for(i=0; i<arr.length; i++){
            if(arr[i].id == wp_index){
                x = arr[i].x;
                y= arr[i].y;
            }
        }
        var path = [];
       
        if(current_floor == -2 ){
            var j;
            for(j=0;j<floorm2_path.length;j++){
                path = floorm2_path[j].path;
                for(i=0; i<path.length; i++){
                    if(path[i][0]==x && path[i][1]==y){
                        draw_path_progress(path,i);
                        return;
                    }
                }
            }  
        }
        else if(current_floor == -1){
            var j;
            for(j=0;j<floorm1_path.length;j++){
                path = floorm1_path[j].path;
                for(i=0; i<path.length; i++){
                    if(path[i][0]==x && path[i][1]==y){
                        draw_path_progress(path,i);
                        return;
                    }
                }
            }  
        }
        else if(current_floor == 0){
            var j;
            for(j=0;j<floor0_path.length;j++){
                path = floor0_path[j].path;
                for(i=0; i<path.length; i++){
                    if(path[i][0]==x && path[i][1]==y){
                        draw_path_progress(path,i);
                        return;
                    }
                }
            }  
        }
        else if(current_floor == 1){
            var j;
            for(j=0;j<floor1_path_path.length;j++){
                path = floor1_path[j].path;
                for(i=0; i<path.length; i++){
                    if(path[i][0]==x && path[i][1]==y){
                        draw_path_progress(path,i);
                        return;
                    }
                }
            }  
        }
        else if(current_floor == 2){
            var j;
            for(j=0;j<floor2_path.length;j++){
                path = floor2_path[j].path;
                for(i=0; i<path.length; i++){
                    if(path[i][0]==x && path[i][1]==y){
                        draw_path_progress(path,i);
                        return;
                    }
                }
            }  
        }
        else if(current_floor == 3){
            var j;
            for(j=0;j<floor3_path.length;j++){
                path = floor3_path[j].path;
                for(i=0; i<path.length; i++){
                    if(path[i][0]==x && path[i][1]==y){
                        draw_path_progress(path,i);
                        return;
                    }
                }
            }  
        }
    }
	
    //draws blue progress path from the beginning till the 'last_wp_index'
    var progress_path = null;
    var draw_path_progress = function(originalPath, last_wp_index){
        if(progress_path!=null)
            progress_path.remove();
        
        new_path = originalPath.slice(0, last_wp_index+1);
        progress_path =  L.polyline(new_path, {color: 'pink',weight:8}).addTo(map);
        return originalPath;
    }
    
    /*watch_location(): watches current geo location and draws a circle on the map using geoservice */
	var watch_location = function(){
		var handler = function(p){
            GeoService.drawUser(p.coords.latitude,p.coords.longitude,current_floor,p.coords.accuracy);
            if(circle._latlng.lat <-80 || circle._latlng.lng <-80 ||circle._latlng.lat > 80 || circle._latlng.lng > 80 ){
                invalid_location_f=true;
                console.log("invalid location");
                //invalid_location_layer.addTo(map);
            }
            else{
                invalid_location_f = false;
                //invalid_location_layer.remove();
                if(follow_mode == true){
                    var coords = circle._latlng;
                    map.setView([coords.lat,coords.lng],3);
                }
                //update_path_progress with the index of the closest waypoint
                if(navigation_active==true)
                    update_path_progress(GeoService.getClosestIndex(circle._latlng.lat,circle._latlng.lng,current_floor));
            }
		}
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(handler);
		} else {
			 alert("Geolocation is not supported by this browser.");
		}
		
		
	}
	
	/* debug function */
    var follow_mode_function = null
	var follow_mode_on=  function(){
        if(circle ==  null)
            return;
        follow_mode = true;
        var coords = circle._latlng;
        map.setView([coords.lat,coords.lng],3);
        if(follow_mode_function!=null)
            follow_mode_function();
	};
    
    var destroy = function(){
        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });
        markers = [];
        map=null;
        follow_mode_function=null;
        unfollow_mode_function=null;
        $("#map_wrap").empty();
    }
    
    var isAlive = function(){
        if(map == null)
            return false;
        return true;
    }
    
    var closest_index = function(){
        if(circle != null)
                return GeoService.getClosestIndex(circle._latlng.lat,circle._latlng.lng,current_floor);
        return 1;
    }
    
    var set_on_navigate = function(func){
        on_navigate = func;
    }
    
    var on_follow_mode = function(fun){
        follow_mode_function = fun;
    }
    
    var on_unfollow_mode = function(fun){
        unfollow_mode_function= fun;
    }
    
    var arrayToString = function(arr){
        var i;
        var str = "";
        for(i=0;i<arr.length;i++){
            str+= arr[i];
            str+=", ";
        }
        return str;
    }
    
	return { initModule: initModule,
			load_floor: load_floor,
			follow_mode_on:follow_mode_on,
			map:map,
            closest_index:closest_index,
            up:up,
            down:down,
            change_lang:change_lang,
			watch_location:watch_location,
            navigate:navigate,
            destroy:destroy,
            on_follow_mode:on_follow_mode,
            on_unfollow_mode:on_unfollow_mode,
            set_on_navigate:set_on_navigate,
            isAlive:isAlive
           };
}();
//$(document).ready(function() {AzrieliMap.initModule('en');});