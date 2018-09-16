// Create a new blank array for all the listing markers.
var markers = [];
//Data
var locations = [
  {name: 'Ahipara', location: {lat: -35.178086, lng: 173.134495}},
  {name: 'Auckland', location: {lat: -36.852956, lng: 174.746125}},
  {name: 'Raglan', location: {lat: -37.800835, lng: 174.867898}},
  {name: 'Napier', location: {lat: -39.489924, lng: 176.918499}},
  {name: 'New Plymouth', location: {lat: -39.058808, lng: 174.080748}},
  {name: 'Wellington', location: {lat: -41.073929, lng: 174.858363}}
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

  //Observable for text input
  this.userInput = ko.observable("");
  // Text filter using knockout
  this.filteredLocations = ko.computed(function() {
    var filter = self.userInput().toLowerCase();
    if (!filter) {
      return self.myLocations();
    }
    return self.myLocations().filter(function(i) {
      return i.name.toLowerCase().indexOf(filter) > -1;
    });
  });
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
    center: {lat: -38.988687, lng: 175.811486},
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

/*Google maps error handling */
function errorHandling() {
  alert("Google Maps has failed to load. Please try again.");
}


