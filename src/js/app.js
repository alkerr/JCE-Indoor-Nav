/*AngularJS App Module */
var app =angular.module('app',  ['pascalprecht.translate','LocalStorageModule']);

app.controller('router',function($scope,$translate,localStorageService){
    //functions for nav
    $(document).ready(function() {  
        $('.selectpicker').change($scope.langChanged);
    });

    $scope.load_map_page = function(){
        console.log("loading map");
        $scope.page = "map.html";
        console.log("calling init");
         setTimeout(function(){
            AzrieliMap.initModule(localStorageService.get("lang"));
         }, 1000);;
        $("#cmd_map").hide();
        $("#cmd_menu").show();
    }
    $scope.load_menu_page = function(){
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
    
    
   //functions for search
    $scope.openLeftMenu= function(){
        document.getElementById("map").style.opacity= "0.5";
        document.getElementById("leftMenu").style.display = "block";
    }
    $scope.closeLeftMenu = function(){
        document.getElementById("map").style.opacity= "1";
        document.getElementById("leftMenu").style.display = "none";
    }
    $scope.search = function(){
        $("#srch_results").empty();
        console.log("searching..");
        console.log($('#srch').val());
        if($('#srch').val() === ""){
             $("#srch_results").append("<br/>what are you searching for?...");
        }
        else{
            var srch = ($('#srch').val()).toLowerCase();
            var res = [];
            for(var i=0; i<destinations.floor0.length; i++){
                var dest = destinations.floor0[i].name;
                if(dest.toLowerCase().includes(srch)){
                    res.push($translate.instant(destinations.floor0[i].name));
                }
                else{
                    var s;
                    for(s=0; s<destinations.floor0[i].services.length; s++){
                        if(destinations.floor0[i].services[s].toLowerCase().includes(srch)){
                            if(!res.includes($translate.instant(destinations.floor0[i].name)))
                                res.push($translate.instant(destinations.floor0[i].name));
                        }
                    }
                }
            }
            for(var i=0; i<destinations.floor1.length; i++){
                var dest = destinations.floor1[i].name;
                if(dest.toLowerCase().includes(srch)){
                    res.push($translate.instant(destinations.floor1[i].name));
                } 
                else{
                    var s;
                    for(s=0; s<destinations.floor1[i].services.length; s++){
                        if(destinations.floor1[i].services[s].toLowerCase().includes(srch)){
                            if(!res.includes($translate.instant(destinations.floor1[i].name)))
                                res.push($translate.instant(destinations.floor1[i].name));
                        }
                    }
                }
            }
            for(var i=0; i<destinations.floor2.length; i++){
                var dest = destinations.floor2[i].name;
                if(dest.toLowerCase().includes(srch)){
                    res.push($translate.instant(destinations.floor2[i].name));
                }
                else{
                    var s;
                    for(s=0; s<destinations.floor2[i].services.length; s++){
                        if(destinations.floor2[i].services[s].toLowerCase().includes(srch)){
                            if(!res.includes($translate.instant(destinations.floor2[i].name)))
                                res.push($translate.instant(destinations.floor2[i].name));
                        }
                    }
                }
            }
            for(var i=0; i<destinations.floor3.length; i++){
                var dest = destinations.floor3[i].name;
                if(dest.toLowerCase().includes(srch)){
                    res.push($translate.instant(destinations.floor3[i].name));
                }
                else{
                    var s;
                    for(s=0; s<destinations.floor3[i].services.length; s++){
                        if(destinations.floor3[i].services[s].toLowerCase().includes(srch)){
                            if(!res.includes($translate.instant(destinations.floor3[i].name)))
                                res.push($translate.instant(destinations.floor3[i].name));
                        }
                    }
                }
            }
            for(var i=0; i<destinations.floorm1.length; i++){
                var dest = destinations.floorm1[i].name;
                if(dest.toLowerCase().includes(srch)){
                    res.push($translate.instant(destinations.floorm1[i].name));
                }
                else{
                    var s;
                    for(s=0; s<destinations.floorm1[i].services.length; s++){
                        if(destinations.floorm1[i].services[s].toLowerCase().includes(srch)){
                            if(!res.includes($translate.instant(destinations.floorm1[i].name)))
                                res.push($translate.instant(destinations.floorm1[i].name));
                        }
                    }
                }
            }
            for(var i=0; i<destinations.floorm2.length; i++){
                var dest = destinations.floorm2[i].name;
                if(dest.toLowerCase().includes(srch)){
                    res.push($translate.instant(destinations.floorm2[i].name));
                }
                else{
                    var s;
                    for(s=0; s<destinations.floorm2[i].services.length; s++){
                        if(destinations.floorm2[i].services[s].toLowerCase().includes(srch)){
                            if(!res.includes($translate.instant(destinations.floorm2[i].name)))
                                res.push($translate.instant(destinations.floorm2[i].name));
                        }
                    }
                }
            }
            if(res.length==0){
                $("#srch_results").append("<br/>No Results Found");
            }
            else{
                res.sort();
                for(var i=0; i<res.length; i++){
                    $("#srch_results").append("<br/>"+res[i]+ "<button> "+$translate.instant('More Info')+" </button><br/>");
                }
            }
        }
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
    $translateProvider.translations('en',english);
    $translateProvider.translations('hb',hebrew);
    $translateProvider.translations('ar',arabic);
    $translateProvider.preferredLanguage('en');
}]);


app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('azmaps');
});


