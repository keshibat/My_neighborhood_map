//Global Variables
var map;
var largeInfowindow;
// Create a new blank array for all the listing markers.
var markers = [];
var locations = [
  {name: 'Ahipara', location: {lat: -35.178086, lng: 173.134495}},
  {name: 'Auckland', location: {lat: -36.852956, lng: 174.746125}},
  {name: 'Raglan', location: {lat: -37.800835, lng: 174.867898}},
  {name: 'Napier', location: {lat: -39.489924, lng: 176.918499}},
  {name: 'New Plymouth', location: {lat: -39.058808, lng: 174.080748}},
  {name: 'Wellington', location: {lat: -41.073929, lng: 174.858363}}
];

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -38.988687, lng: 175.811486},
    zoom: 13,
    mapTypeControl: false
  });
  //all lists to adjust the boundaries of the map
  var bounds = new google.maps.LatLngBounds();
  largeInfowindow = new google.maps.InfoWindow();
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].name;
    // Create a marker per location, and put into markers array.
     var marker = new google.maps.Marker({
      position: position,
      map: map,
      name: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    // Extend boundaries for every marker that we make
    bounds.extend(markers[i].position);
  }
  //  tell the map to fit itself to those bounds
  map.fitBounds(bounds);
  // Activates knockout.js
  ko.applyBindings(new ViewModel());
 }
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.name + '</div>');
    marker.setAnimation( google.maps.Animation.BOUNCE ); // Bounce marker when list view item is clicked
    infowindow.open(map, marker);
    //infowindow.open(map, place.marker); // Open info window on correct marker when list item is clicked
    setTimeout( function() {
        marker.setAnimation( null ); // End animation on marker after 2 seconds
    }, 2000 );
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}
//Google maps error handling
function errorHandling() {
  alert("Google Maps has failed to load. Please try again.");
}

var Location = function(data) {
  this.name =  data.name;
  this.location = data.location;
  this.marker = data.marker;
}
// ViewModel - JavaScript that defines the data and behavior of your UI
var ViewModel = function() {
  var self = this;
  // Stores and updates userInput from index.html line 15 with a knockout.js
  this.userInput = ko.observable("");
  // Stores and upates markers in knockout.js observable array
  this.myLocations = ko.observableArray();
  //Iterates over markers array and creates copies in the locations observable array
  for ( var i = 0; i < markers.length; i++) {
    self.myLocations.push(markers[i])
  }
  // Stores and upates weather Info
  this.imagePath = ko.observable("");
  this.temperature = ko.observable("");
  this.weather = ko.observable("");

  var apiEndpoint = 'https://api.openweathermap.org/data/2.5/weather?q=Raglan&appid=03d50e04ac1ff057206fb92d6d047092';
  $.getJSON(apiEndpoint, data => {
        this.imagePath(`https://openweathermap.org/img/w/${data.weather[0].icon}.png`);
        this.temperature(data.main.temp - 273.15);
        this.weather(data.weather[0].main);
    }).fail(() => alert("Cannot fetch weather data from the servers. Please try again later."));        // Error handling.
  //Animates the markers and opens the infowindow when text in the listview is clicked
  this.listViewClick = function(marker) {
    google.maps.event.trigger(marker, 'click');
  }
  // Filter Marker
  this.filteredLocations = ko.computed(function() {
    var filter = self.userInput().toLowerCase();
    if (!filter) {
      self.myLocations().forEach(function(item){
        item.setVisible(true);
      });
      return self.myLocations();
    } else {
      return ko.utils.arrayFilter(self.myLocations(), function(item) {
        var match = item.name.toLowerCase().indexOf(filter) >= 0
              item.setVisible(match);
              return match;
      })
    }}, self);

}


// Mouserover highlighted for sidebar
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle('active');
}

