/*AngularJS App Module */
var app =angular.module('app',  ['pascalprecht.translate','LocalStorageModule']);

app.controller('router',function($scope,$translate,localStorageService){
    //functions for nav
    $(document).ready(function() {  
        $('.selectpicker').change($scope.langChanged);
    });
    
    $scope.map_loaded = false;
    
    $scope.load_map_page = function(){
        $scope.res = [];
        console.log("loading map");
        $scope.page = "map.html";
        console.log("calling init");
         setTimeout(function(){
            AzrieliMap.initModule(localStorageService.get("lang"));
            $scope.map_loaded = true;
         }, 1000);;
        $("#cmd_map").hide();
        $("#cmd_menu").show();
    }
    $scope.load_menu_page = function(){
        if(AzrieliMap.isAlive())
            AzrieliMap.destroy();
        $scope.map_loaded = false;
        $scope.page = "menu.html";
        
        $("#menu_dest_lst").show();
        $("#menu_dest_view").empty();
        $("#menu_cmd_nav").hide();
        
        $("#cmd_menu").hide();
        $("#cmd_map").show();
     }

    $scope.getPage = function(){
          return $scope.page;
     }
    
    $scope.langChanged = function(){
        var lang = $(".selectpicker").val();
        console.log("picked: "+lang);
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
        console.log("value: "+localStorageService.get("lang"));
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
        console.log("searching..");
        console.log($('#srch').val());
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
                    $scope.res.push({name:destinations.floor0[i].name,floor:0,index:i,x:x,y:y});
                }
                else{
                    var s;
                    for(s=0; s<destinations.floor0[i].services.length; s++){
                        if(destinations.floor0[i].services[s].toLowerCase().includes(srch)){
                            if(!name_in_result(destinations.floor0[i].name)){
                                var x = destinations.floor0[i].coord[0];
                                var y = destinations.floor0[i].coord[1];
                                $scope.res.push({name:destinations.floor0[i].name,floor:0,index:i,x:x,y:y});
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
                    $scope.res.push({name:destinations.floor1[i].name,floor:1,index:i,x:x,y:y});
                } 
                else{
                    var s;
                    for(s=0; s<destinations.floor1[i].services.length; s++){
                        if(destinations.floor1[i].services[s].toLowerCase().includes(srch)){
                            if(!name_in_result(destinations.floor1[i].name)){
                                var x = destinations.floor1[i].coord[0];
                                var y = destinations.floor1[i].coord[1];
                                $scope.res.push({name:destinations.floor1[i].name,floor:1,index:i,x:x,y:y});
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
                    $scope.res.push({name:destinations.floor2[i].name,floor:2,index:i,x:x,y:y});
                }
                else{
                    var s;
                    for(s=0; s<destinations.floor2[i].services.length; s++){
                        if(destinations.floor2[i].services[s].toLowerCase().includes(srch)){
                            if(!name_in_result(destinations.floor2[i].name)){
                                var x = destinations.floor2[i].coord[0];
                                var y = destinations.floor2[i].coord[1];
                                $scope.res.push({name:destinations.floor2[i].name,floor:2,index:i,x:x,y:y});
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
                    $scope.res.push({name:destinations.floor3[i].name,floor:3,index:i,x:x,y:y});
                }
                else{
                    var s;
                    for(s=0; s<destinations.floor3[i].services.length; s++){
                        if(destinations.floor3[i].services[s].toLowerCase().includes(srch)){
                            if(!name_in_result(destinations.floor3[i].name)){
                                var x = destinations.floor3[i].coord[0];
                                var y = destinations.floor3[i].coord[1];
                                $scope.res.push({name:destinations.floor3[i].name,floor:3,index:i,x:x,y:y});
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
                    $scope.res.push({name:destinations.floorm1[i].name,floor:-1,index:i,x:x,y:y});
                }
                else{
                    var s;
                    for(s=0; s<destinations.floorm1[i].services.length; s++){
                        if(destinations.floorm1[i].services[s].toLowerCase().includes(srch)){
                            if(!name_in_result(destinations.floorm1[i].name)){
                                var x = destinations.floorm1[i].coord[0];
                                var y = destinations.floorm1[i].coord[1];
                                $scope.res.push({name:destinations.floorm1[i].name,floor:-1,index:i,x:x,y:y});
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
                    $scope.res.push({name:destinations.floorm2[i].name,floor:-2,index:i,x:x,y:y});
                }
                else{
                    var s;
                    for(s=0; s<destinations.floorm2[i].services.length; s++){
                        if(destinations.floorm2[i].services[s].toLowerCase().includes(srch)){
                            if(!name_in_result(destinations.floorm2[i].name)){
                                var x = destinations.floorm2[i].coord[0];
                                var y = destinations.floorm2[i].coord[1];
                                $scope.res.push({name:destinations.floorm2[i].name,floor:-2,index:i,x:x,y:y});
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
        console.log($scope.res);
    }
    
    $scope.srch_minfo = function(floor,index){
        $scope.load_menu_page();
        setTimeout(function(){
            $scope.view_dest(floor,index);
         }, 500);;
        
    }
    
    $scope.srch_nav = function(x,y,f){
        var dest_id =  GeoService.getClosestIndex(x,y,f);
        AzrieliMap.navigate(1,dest_id);
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
    
    
    
    //functions for menu page
    $scope.destinations=destinations;
    $scope.view_dest = function(floor,index){
        console.log("VIEW DEST()");
        $("#menu_dest_lst").hide();
        $("#menu_cmd_nav").show();
        if(floor==-2){
            console.log(destinations.floorm2[index].name);
        }
        else if(floor == -1){
            console.log(destinations.floorm1[index].name);
            
        }
        else if(floor == 0){
            $("#menu_dest_view").append($translate.instant(destinations.floor0[index].name));
            $("#menu_dest_view").append("<br>");
            var i;
            for(i=0;i<destinations.floor0[index].services.length; i++){
                
                $("#menu_dest_view").append($translate.instant(destinations.floor0[index].services[i]));
                $("#menu_dest_view").append("<br>");
            }
           
        }
        else if(floor == 1){
            console.log(destinations.floor1[index].name);
        }
        else if(floor == 2){
            console.log(destinations.floor2[index].name);
        }
        else if(floor == 3){
            console.log(destinations.floor3[index].name);
        }
        $("#cmd_map").hide();
        $("#cmd_menu").show();
    };
    
    

 
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


