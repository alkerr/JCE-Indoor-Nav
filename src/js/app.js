/*Translation objects */
var english = {
    'MAP':'Map',
    'MENU':'Menu'
};

var herbrew = {
    'MAP':'מַפָּה',
    'MENU':'תַפרִיט'
}
var arabic = {
    'MAP':'خريطة',
    'MENU':'قائمة'
}


/*AngularJS App Module */
var app =angular.module('app',  ['pascalprecht.translate','LocalStorageModule']);

app.controller('router',function($scope,$translate,localStorageService){
    //functions for nav
    $scope.load_map_page = function(){
        $scope.page = "map.html"
        setTimeout(AzrieliMap.initModule, 500);
    }
    $scope.load_menu_page = function(){
         $scope.page = "language.html"
     }

    $scope.getPage = function(){
          return $scope.page;
     }
    
    $scope.langChanged = function(){
        var lang = $(".selectpicker").val();
        if(lang == "English"){
            $translate.use("en");
            localStorageService.set("lang","en");
        }
        else if(lang == "عربي"){
            $translate.use("ar");
            localStorageService.set("lang","ar");
        }
        else if(lang == "עִברִית"){
            $translate.use("hb");
            localStorageService.set("lang","hb");
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
    
    
    //functions for language page
    $scope.pick_en = function(){
        localStorageService.set("lang","en");
        $translate.use("en");
        $(".selectpicker").val("English");
        $("#nav").show();
        $scope.load_map_page();
    }
    $scope.pick_ar = function(){
        localStorageService.set("lang","ar");
        $translate.use("ar");
        $(".selectpicker").val("عربي");
        $("#nav").show();
        $scope.load_map_page();
    }
    $scope.pick_hb = function(){
        localStorageService.set("lang","hb");
        $translate.use("hb");
        $(".selectpicker").val("עִברִית");
        $("#nav").show();
        $scope.load_map_page();
    }
    
    
    //functions for menu page
    
    
 
});


app.config(['$translateProvider', function($translateProvider) {
    $translateProvider.translations('en',english);
    $translateProvider.translations('hb',herbrew);
    $translateProvider.translations('ar',arabic);
    $translateProvider.preferredLanguage('en');
}]);


app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('azmaps');
});


