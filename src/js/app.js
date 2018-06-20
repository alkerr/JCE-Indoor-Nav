 /* //fetch destinations.js from firebase 
 var config = {
    apiKey: "AIzaSyBlxfM3IXXsy1qU8gW_nJy0W_oWQFM5DK8",
    authDomain: "azsrchtester2.firebaseapp.com",
    databaseURL: "https://azsrchtester2.firebaseio.com",
    projectId: "azsrchtester2",
    storageBucket: "azsrchtester2.appspot.com",
    messagingSenderId: "709578488524"
};
firebase.initializeApp(config);

var dest_ref = firebase.storage().refFromURL('CLOUD LOCATION URL');
console.log(dest_ref);
dest_ref.child('DATA_FILE_NAME').getDownloadURL().then(function(url) {

console.log(url);
console.log("done");
// This can be downloaded directly:
var xhr = new XMLHttpRequest();
xhr.responseType = 'blob';
xhr.onload = function(event) {
var blob = xhr.response;
};
xhr.open('GET', url);
xhr.send();

// Or inserted into an <img> element:
var dest = document.getElementById('dest_script');
dest.src = url;
}).catch(function(error) {
      // Handle any errors
    console.log("-- ERROR --");
    console.log(error);
});

*/

/*AngularJS App Module */
var app =angular.module('app',  ['pascalprecht.translate','LocalStorageModule','firebase']);

app.controller('router',function($scope,$translate,localStorageService){
    $("#nav_info").hide();
    //functions for nav
    $(document).ready(function() {  
        $('.selectpicker').change($scope.langChanged);
    });
    
    $scope.map_loaded = false;
    
    
    //functions for map load
    var show_follow_button = function(){
        $("#cmd_follow").show();
    }
    var hide_follow_button = function(){
        $("#cmd_follow").hide();
    }
    var update_nav_info = function(title){
        $("#nav_info").empty();
        if(title == null){
            $("#nav_info").hide();
            return;
        }
        $("#nav_info").append($translate.instant('NAV_TO')+$translate.instant(title)+'  ');
        $("#nav_info").append('<button onclick="AzrieliMap.navigate(-1,-1)" class="button small">'+$translate.instant('Cancel')+'</button>');
        $("#nav_info").show();
    }
    
    $scope.load_map_page = function(){
        $scope.res = [];
        $scope.page = "map.html";
        setTimeout(function(){
            AzrieliMap.initModule(localStorageService.get("lang"));
            $scope.map_loaded = true;
            AzrieliMap.on_follow_mode(hide_follow_button);
            AzrieliMap.on_unfollow_mode(show_follow_button);
            AzrieliMap.set_on_navigate(update_nav_info);
         }, 1000);;
        $("#cmd_map").hide();
        $("#cmd_menu").show();
    }
    $scope.load_menu_page = function(){
        if(AzrieliMap.isAlive())
            AzrieliMap.destroy();
        $(".menu_tab").show();
        $scope.more_info = {};
        $scope.menu_list = [];
        $scope.map_loaded = false;
        $scope.page = "menu.html";
        
        
        $("#cmd_menu").hide();
        $("#cmd_map").show();
        
        $("#cmd_office").removeClass("picked");
        $("#cmd_class").removeClass("picked");
        $("#cmd_other").removeClass("picked");
        $("#cmd_lab").removeClass("picked");
     }

    $scope.getPage = function(){
          return $scope.page;
     }
    
    $scope.langChanged = function(){
        var lang = $(".selectpicker").val();
        if(lang == "English"){
            $translate.use("en");
            localStorageService.set("lang","en");
            AzrieliMap.change_lang('en');
        }
        else if(lang == "عربي"){
            $translate.use("ar");
            localStorageService.set("lang","ar");
            AzrieliMap.change_lang('ar');
        }
        else if(lang == "עִברִית"){
            $translate.use("hb");
            localStorageService.set("lang","hb");
            AzrieliMap.change_lang('hb');
        }
    }
    
    
	//checking local storage
	var language = localStorageService.get("lang");
	if(language == null){
		$scope.page = "language.html";
		$("#nav").hide();
	}
    else{
        $translate.use(language);
        if(language=="en"){
            $(".selectpicker").val("English");
        }
        else if(language=="ar"){
            $(".selectpicker").val("عربي");
        }
        else if(language=="hb"){
            $(".selectpicker").val("עִברִית");
        }
        $scope.load_map_page();
    }
    
    
    var name_in_result= function(name){
        var i;
        for(i=0; i<$scope.res.length;i++){
            if($scope.res[i].name == name)
                return true;
        }
        return false;
    }
    
   //functions for search
    $scope.openLeftMenu= function(){
        document.getElementById("map").style.opacity= "0.5";
        document.getElementById("leftMenu").style.display = "block";
    }
    $scope.closeLeftMenu = function(){
        document.getElementById("map").style.opacity= "1";
        document.getElementById("leftMenu").style.display = "none";
    }
    
    $scope.res = []; //array of resutls [{name:"",floor:f,index:i,x:x,y:y}]
    $scope.search = function(){
        //$("#srch_results").empty();
        $scope.res=[];
        if($('#srch').val() === ""){
            $scope.res.push({name:"what are you searching for?...",index:-1});
        }
        else{
            var srch = ($('#srch').val()).toLowerCase();
            $scope.res = [];
            for(var i=0; i<destinations.floor0.length; i++){
                var dest = destinations.floor0[i].name;
                if(dest.toLowerCase().includes(srch)){
                    var x = destinations.floor0[i].coord[0];
                    var y = destinations.floor0[i].coord[1];
                    var cwp = destinations.floor0[i].closest_waypoint;
                    $scope.res.push({name:destinations.floor0[i].name,floor:0,index:i,x:x,y:y,cwp:cwp});
                }
                else{
                    var s;
                    for(s=0; s<destinations.floor0[i].services.length; s++){
                        if(destinations.floor0[i].services[s].toLowerCase().includes(srch)){
                            if(!name_in_result(destinations.floor0[i].name)){
                                var x = destinations.floor0[i].coord[0];
                                var y = destinations.floor0[i].coord[1];
                                var cwp = destinations.floor0[i].closest_waypoint;
                                $scope.res.push({name:destinations.floor0[i].name,floor:0,index:i,x:x,y:y,cwp:cwp});
                            }
                        }
                    }
                }
            }
            for(var i=0; i<destinations.floor1.length; i++){
                var dest = destinations.floor1[i].name;
                if(dest.toLowerCase().includes(srch)){
                    var x = destinations.floor1[i].coord[0];
                    var y = destinations.floor1[i].coord[1];
                    var cwp = destinations.floor1[i].closest_waypoint;
                    $scope.res.push({name:destinations.floor1[i].name,floor:1,index:i,x:x,y:y,cwp:cwp});
                } 
                else{
                    var s;
                    for(s=0; s<destinations.floor1[i].services.length; s++){
                        if(destinations.floor1[i].services[s].toLowerCase().includes(srch)){
                            if(!name_in_result(destinations.floor1[i].name)){
                                var x = destinations.floor1[i].coord[0];
                                var y = destinations.floor1[i].coord[1];
                                var cwp = destinations.floor1[i].closest_waypoint;
                                $scope.res.push({name:destinations.floor1[i].name,floor:1,index:i,x:x,y:y,cwp:cwp});
                            }
                                
                        }
                    }
                }
            }
            for(var i=0; i<destinations.floor2.length; i++){
                var dest = destinations.floor2[i].name;
                if(dest.toLowerCase().includes(srch)){
                    var x = destinations.floor2[i].coord[0];
                    var y = destinations.floor2[i].coord[1];
                    var cwp = destinations.floor2[i].closest_waypoint;
                    $scope.res.push({name:destinations.floor2[i].name,floor:2,index:i,x:x,y:y,cwp:cwp});
                }
                else{
                    var s;
                    for(s=0; s<destinations.floor2[i].services.length; s++){
                        if(destinations.floor2[i].services[s].toLowerCase().includes(srch)){
                            if(!name_in_result(destinations.floor2[i].name)){
                                var x = destinations.floor2[i].coord[0];
                                var y = destinations.floor2[i].coord[1];
                                var cwp = destinations.floor2[i].closest_waypoint;
                                $scope.res.push({name:destinations.floor2[i].name,floor:2,index:i,x:x,y:y,cwp:cwp});
                            }
                        }
                    }
                }
            }
            for(var i=0; i<destinations.floor3.length; i++){
                var dest = destinations.floor3[i].name;
                if(dest.toLowerCase().includes(srch)){
                    var x = destinations.floor3[i].coord[0];
                    var y = destinations.floor3[i].coord[1];
                    var cwp = destinations.floor3[i].closest_waypoint;
                    $scope.res.push({name:destinations.floor3[i].name,floor:3,index:i,x:x,y:y,cwp:cwp});
                }
                else{
                    var s;
                    for(s=0; s<destinations.floor3[i].services.length; s++){
                        if(destinations.floor3[i].services[s].toLowerCase().includes(srch)){
                            if(!name_in_result(destinations.floor3[i].name)){
                                var x = destinations.floor3[i].coord[0];
                                var y = destinations.floor3[i].coord[1];
                                var cwp = destinations.floor3[i].closest_waypoint;
                                $scope.res.push({name:destinations.floor3[i].name,floor:3,index:i,x:x,y:y,cwp:cwp});
                            }
                        }
                    }
                }
            }
            for(var i=0; i<destinations.floorm1.length; i++){
                var dest = destinations.floorm1[i].name;
                if(dest.toLowerCase().includes(srch)){
                    var x = destinations.floorm1[i].coord[0];
                    var y = destinations.floorm1[i].coord[1];
                    var cwp = destinations.floorm1[i].closest_waypoint;
                    $scope.res.push({name:destinations.floorm1[i].name,floor:-1,index:i,x:x,y:y,cwp:cwp});
                }
                else{
                    var s;
                    for(s=0; s<destinations.floorm1[i].services.length; s++){
                        if(destinations.floorm1[i].services[s].toLowerCase().includes(srch)){
                            if(!name_in_result(destinations.floorm1[i].name)){
                                var x = destinations.floorm1[i].coord[0];
                                var y = destinations.floorm1[i].coord[1];
                                var cwp = destinations.floorm1[i].closest_waypoint;
                                $scope.res.push({name:destinations.floorm1[i].name,floor:-1,index:i,x:x,y:y,cwp:cwp});
                            }
                        }
                    }
                }
            }
            for(var i=0; i<destinations.floorm2.length; i++){
                var dest = destinations.floorm2[i].name;
                if(dest.toLowerCase().includes(srch)){
                    var x = destinations.floorm2[i].coord[0];
                    var y = destinations.floorm2[i].coord[1];
                    var cwp = destinations.floorm2[i].closest_waypoint;
                    $scope.res.push({name:destinations.floorm2[i].name,floor:-2,index:i,x:x,y:y,cwp:cwp});
                }
                else{
                    var s;
                    for(s=0; s<destinations.floorm2[i].services.length; s++){
                        if(destinations.floorm2[i].services[s].toLowerCase().includes(srch)){
                            if(!name_in_result(destinations.floorm2[i].name)){
                                var x = destinations.floorm2[i].coord[0];
                                var y = destinations.floorm2[i].coord[1];
                                var cwp = destinations.floorm2[i].closest_waypoint;
                                $scope.res.push({name:destinations.floorm2[i].name,floor:-2,index:i,x:x,y:y,cwp:cwp});
                            }
                        }
                    }
                }
            }
            if($scope.res.length==0){
                $scope.res.push({name:"No Results Found",index:-1});
            }
            else{
                $scope.res.sort();
                /*for(var i=0; i<res.length; i++){
                    $("#srch_results").append("<br/>"+res[i]+ "<button> "+$translate.instant('More Info')+" </button><br/>");
                }*/
            }
        }
    }
    
    $scope.srch_minfo = function(floor,index,x,y,hrs){
        $scope.load_menu_page();
        setTimeout(function(){
            $scope.view_dest(floor,index,x,y,hrs);
         }, 1000);;
        
    }
    
    $scope.srch_nav = function(x,y,f,title,cwp){
        var dest_id =  GeoService.getClosestIndex(x,y,f);
        if(cwp != null){
            AzrieliMap.navigate(AzrieliMap.closest_index(),cwp,title);
        }
        else
            AzrieliMap.navigate(AzrieliMap.closest_index(),dest_id,title);
        $scope.closeLeftMenu();
        
    }
    
    
    //functions for language page
    $scope.pick_en = function(){
        localStorageService.set("lang","en");
        $translate.use("en");
        $(".selectpicker").val("English");
        $("#nav").show();
        $scope.load_map_page();
    };
    $scope.pick_ar = function(){
        localStorageService.set("lang","ar");
        $translate.use("ar");
        $(".selectpicker").val("عربي");
        $("#nav").show();
        $scope.load_map_page();
    };
    $scope.pick_hb = function(){
        localStorageService.set("lang","hb");
        $translate.use("hb");
        $(".selectpicker").val("עִברִית");
        $("#nav").show();
        $scope.load_map_page();
    };
    
    $scope.destinations=destinations;
    var get_menu_list = function(type){
        var list =[];
        var i;
        var data = destinations.floorm2;
        for(i=0;i<data.length;i++){
            if(data[i].type == type){   
                list.push({name:data[i].name,floor:-2,index:i,x:data[i].coord[0],y:data[i].coord[1],cwp:data[i].closest_waypoint,hrs:data[i].hours});
            }
        }
        
        data = destinations.floorm1;
        for(i=0;i<data.length;i++){
            if(data[i].type == type){
                list.push({name:data[i].name,floor:-1,index:i,x:data[i].coord[0],y:data[i].coord[1],cwp:data[i].closest_waypoint,hrs:data[i].hours});
            }
        }
        
        data = destinations.floor0;
        for(i=0;i<data.length;i++){
            if(data[i].type == type){
                list.push({name:data[i].name,floor:0,index:i,x:data[i].coord[0],y:data[i].coord[1],cwp:data[i].closest_waypoint,hrs:data[i].hours});
            }
        }
        
        data = destinations.floor1;
        for(i=0;i<data.length;i++){
            if(data[i].type == type){
                list.push({name:data[i].name,floor:1,index:i,x:data[i].coord[0],y:data[i].coord[1],cwp:data[i].closest_waypoint,hrs:data[i].hours});
            }
        }
        
        data = destinations.floor2;
        for(i=0;i<data.length;i++){
            if(data[i].type == type){
                list.push({name:data[i].name,floor:2,index:i,x:data[i].coord[0],y:data[i].coord[1],cwp:data[i].closest_waypoint,hrs:data[i].hours});
            }
        }
        
        data = destinations.floor3;
        for(i=0;i<data.length;i++){
            if(data[i].type == type){
                list.push({name:data[i].name,floor:3,index:i,x:data[i].coord[0],y:data[i].coord[1],cwp:data[i].closest_waypoint,hrs:data[i].hours});
            }
        }
        return list;
    }
    
    //functions for menu page
    $scope.menu_list = []; //array of {name:"",floor:f,index:i,x:x,y:y}
    $scope.on_class_click = function(){
        $("#cmd_office").removeClass("picked");
        $("#cmd_lab").removeClass("picked");
        $("#cmd_other").removeClass("picked");
        $("#cmd_class").addClass("picked");
        $scope.menu_list = get_menu_list("classroom");
    }
    $scope.on_office_click = function(){
        $("#cmd_office").addClass("picked");
        $("#cmd_class").removeClass("picked"); 
        $("#cmd_lab").removeClass("picked");
        $("#cmd_other").removeClass("picked");
        $scope.menu_list = get_menu_list("office");
    }
    $scope.on_lab_click = function(){
        $("#cmd_office").removeClass("picked");
        $("#cmd_class").removeClass("picked");
        $("#cmd_other").removeClass("picked");
        $("#cmd_lab").addClass("picked");
        $scope.menu_list = get_menu_list("lab");
    }
    $scope.on_other_click = function(){
        $("#cmd_office").removeClass("picked");
        $("#cmd_lab").removeClass("picked");
        $("#cmd_class").removeClass("picked");
        $("#cmd_other").addClass("picked");
        $scope.menu_list = get_menu_list("other");
    }
   
    var get_more_info = function(data,index,floor,hrs){
        if(index>=data.length)
            return;
        
        var arr = [];
        arr.push(data[index].name);
        if(hrs!= null && hrs.length>0){
            arr.push("Hours:");
            arr.push(hrs)
            arr.push("\n");
        }
        arr.push("In Floor "+floor);
        arr.push("\n");
        var i;
        for(i=0; i<data[index].services.length;i++){
            arr.push(data[index].services[i]);
        }
        return arr;
    }
    $scope.more_info = {}; // object of {strings:[],floor:f,x:x,y:y,name:n,hrs:h}
    $scope.view_dest = function(floor,index,x,y,hrs){
        $(".menu_tab").hide();
        var name = null;
        var cwp = null;
        var hrs = null
        $scope.menu_list = [];
        if(floor==-2){
            $scope.more_info.strings = get_more_info(destinations.floorm2,index,floor,hrs);
            name = destinations.floorm2[index].name;
            cwp = destinations.floorm2[index].closest_waypoint;
            if(destinations.floorm2[index].hours)
                hrs = '';
            else
                hrs = destinations.floorm2[index].hours;
        }
        else if(floor == -1){
            $scope.more_info.strings = get_more_info(destinations.floorm1,index,floor,hrs);
            name = destinations.floorm1[index].name;
            cwp = destinations.floorm1[index].closest_waypoint;
            if(destinations.floorm1[index].hours)
                hrs = '';
            else
                hrs = destinations.floorm1[index].hours;
        }
        else if(floor == 0){
           $scope.more_info.strings = get_more_info(destinations.floor0,index,floor,hrs);
            name = destinations.floor0[index].name;
            cwp = destinations.floor0[index].closest_waypoint;
            if(destinations.floor0[index].hours)
                hrs = '';
            else
                hrs = destinations.floor0[index].hours;
        }
        else if(floor == 1){
            $scope.more_info.strings = get_more_info(destinations.floor1,index,floor,hrs);
            name = destinations.floor1[index].name;
            cwp = destinations.floor1[index].closest_waypoint;
            if(destinations.floor1[index].hours)
                hrs = '';
            else
                hrs = destinations.floor1[index].hours;
        }
        else if(floor == 2){
            $scope.more_info.strings = get_more_info(destinations.floor2,index,floor,hrs);
            name = destinations.floor2[index].name;
            cwp = destinations.floor2[index].closest_waypoint;
            if(destinations.floor2[index].hours)
                hrs = '';
            else
                hrs = destinations.floor2[index].hours;
        }
        else if(floor == 3){
            $scope.more_info.strings = get_more_info(destinations.floor3,index,floor,hrs);
            name = destinations.floor3[index].name;
            cwp = destinations.floor3[index].closest_waypoint;
            if(destinations.floor3[index].hours)
                hrs = '';
            else
                hrs = destinations.floor3[index].hours;
        }
        $scope.more_info.name = name;
        $scope.more_info.floor = floor;
        $scope.more_info.x = x;
        $scope.more_info.y = y;
        $scope.more_info.cwp = cwp;
        $scope.more_info.hrs = hrs;
        $("#cmd_menu").show();
    };
    
    $scope.menu_nav = function(x,y,f,title,cwp){
        $scope.more_info = {};
        $scope.load_map_page();
        setTimeout(function(){
            while($scope.map_loaded!=true){
            }
            $scope.srch_nav(x,y,f,title,cwp);
         }, 1000);;
     
        
    }
    

 
});

app.config(['$translateProvider', function($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.translations('en',english);
    $translateProvider.translations('hb',hebrew);
    $translateProvider.translations('ar',arabic);
    $translateProvider.preferredLanguage('en');
}]);


app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('azmaps');
});


