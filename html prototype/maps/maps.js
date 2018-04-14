function initMap() {
        var uluru = {lat: 31.769057, lng: 35.193708};
        var map = new google.maps.Map(document.getElementById('main'),{
          zoom: 19,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
		});
}