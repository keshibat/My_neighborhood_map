// Create a new blank array for all the listing markers.
var markers = [];
//Data
var locations = [
  {name: 'Auckland', location: {lat: 40.7713024, lng: -73.9632393}},
  {name: 'Raglan', location: {lat: 40.7444883, lng: -73.9949465}},
  {name: 'Napier', location: {lat: 40.7347062, lng: -73.9895759}},
  {name: 'Ahipara', location: {lat: 40.7281777, lng: -73.984377}},
  {name: 'New Plymouth', location: {lat: 40.7195264, lng: -74.0089934}},
  {name: 'Wellington', location: {lat: 40.7180628, lng: -73.9961237}}
];


var Location = function(data) {
  this.name =  data.name;
  this.location = data.location;
  this.marker = data.marker;
}



// ViewModel - JavaScript that defines the data and behavior of your UI
var ViewModel = function() {
  var self = this;
  this.myLocations = ko.observableArray([]);
  locations.forEach(function(locationItem){
    self.myLocations.push( new Location(locationItem) );
  });
  this.currentLocation = ko.observable( this.myLocations() [0] );
  //Observable for text input
  self.filter = ko.observable("");
  // Text filter using knockout
  self.filteredItems = ko.computed(function() {
    var filter = this.filter().toLowerCase();
    if (!filter) {
        return self.myLocations();
    } else {
        return ko.utils.arrayFilter(self.myLocations(), function(item) {
            return ko.utils.indexOf(item.name().toLowerCase().indexOf(filter) > -1);
        });
    }
}, this);
}



// Activates knockout.js
ko.applyBindings(new ViewModel());



function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle('active');
}

var map;
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13,
    mapTypeControl: false
  });





  var largeInfowindow = new google.maps.InfoWindow();
  //all lists to adjust the boundaries of the map
  var bounds = new google.maps.LatLngBounds();
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
     var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: title,
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
 }
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}


