// Global map variable
var map;

// Sets the path for custom icons
var iconPath = 'images/';

// Controls the size ratio of map markers
var ratioWidth = 30;
var ratioHeight = 43;

// Stores two Stockholm cordinates incase all categories are unchecked in the menu
var stockholmLatLng = [new google.maps.LatLng(59.341501, 18.004443), new google.maps.LatLng(59.309142, 18.124005)];

// Holds the position of all the current markers inable to set the viewpoint
var viewpointArray = [];

// Initialize the map
var mapOptions;
var userPosition;
var userMarkerLatLng;
function initialize() {
  console.log("Nu är vi inne i initialize");
  console.log("userCordsCheck är: "+userCordsCheck);
	// Check if we have user position, else start in Gamla Stan
  if(userCordsCheck === true) {
    mapOptions = {
		  zoom: 13,
			center: new google.maps.LatLng(userCordsLat, userCordsLong),
      disableDefaultUI: true,
      // zoomControl: true,
      // zoomControlOptions: {
      //   position: google.maps.ControlPosition.TOP_CENTER
      // },
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
			styles: mapJson
		};
		} else {
		mapOptions = {
			zoom: 13,
			center: new google.maps.LatLng(59.324813, 18.070284),
      disableDefaultUI: true,
      // zoomControl: true,
      // zoomControlOptions: {
      //   position: google.maps.ControlPosition.TOP_CENTER
      // },
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
			styles: mapJson
			};
		}

	// Push map variables into the div
	map = new google.maps.Map(document.getElementById('mapContainer'), mapOptions);

  // Creates a dot on the map if we have the users position
  if(userCordsCheck === true) {
    var userMarkerLatLng = {lat: userCordsLat, lng: userCordsLong};
    userPosition = new google.maps.Marker({
	  	position: userMarkerLatLng,
	    map: map,
      clickable: false,
			icon: {
	    	scaledSize: new google.maps.Size(60, 60),
				url: iconPath + "locationdot.svg"
			},
      zIndex: 900
	  });
  }
}

// Takes in HTML from setMarkers and creates infowindws
infowindow = new google.maps.InfoWindow({
    // maxWidth: 300,
    content: "Holding..."
});

// Creates the Google Map markers
var markerStorage = [];
var firebaseLatLong = [];
function setMarkers() {
	// This function is used further down
	function infowindowClicker() {
		infowindow.setContent(this.html);
		infowindow.open(map, this);
	}
	console.log("*** setMarkers starting ***");
	for (var i = 0; i < latArray.length; i++) {


		var arrayLatLng = new google.maps.LatLng(latArray[i], longArray[i]);

		var markerGenerator = new google.maps.Marker({
	  	position: arrayLatLng,
	    map: map,
			// icon: {
	    // 	scaledSize: new google.maps.Size(ratioWidth, ratioHeight),
			// 	url: iconPath + "" + iconName + ".png"
			// },
	    animation: google.maps.Animation.DROP,
	    title: messageArray[i],
	    zIndex: 900,
			html: messageArray[i]
	  });

		// Push the markers to their seperate arrays
		markerStorage.push(markerGenerator);

    // Push the latitude and longitude values to their category array
    firebaseLatLong.push(arrayLatLng);

    // Takes the existing latitude and longitude values and sets the viewpoint
    viewpointArray = stockholmLatLng.concat(firebaseLatLong);
    // console.log(viewpointArray);

		// Fetch the HTML and put them in the infowindows
		google.maps.event.addListener(markerGenerator, 'click', infowindowClicker());
	}

	  // Create a new viewpoint bound
	  var bounds = new google.maps.LatLngBounds();
	  // Cycle through all of the viewpoint arrays
	  for (var x = 0; x < viewpointArray.length; x++) {
	    // Increase the bounds of whats currently in it
	    bounds.extend(viewpointArray[x]);
	  }
	  //  Adjust the map to fit all of the current markers
	  map.fitBounds(bounds);
}

// Removes markers by category / Removes the viewpoint arrays
// function removeMarkers(categoryArray, viewpointArrayDeleter)
function removeMarkers() {
    for(var i = 0; i < markerStorage.length; i++) {
        markerStorage[i].setMap(null);
    }
    markerStorage.length = 0;
    viewpointArray = stockholmLatLng.concat(firebaseLatLong);

    var bounds = new google.maps.LatLngBounds();
		if (viewpointArray !== null) {
			// If we don't have any markers we zoom in on our position
			var latFenceMax = userCordsLat+0.000625;
			var latFenceMin = userCordsLat-0.000625;
			var longFenceMax = userCordsLong+0.00125;
			var longFenceMin = userCordsLong-0.00125;

			map.fitBounds(new google.maps.LatLngBounds(
  		// Bottom left
  		new google.maps.LatLng(latFenceMin, longFenceMin),
  		// Top right
  		new google.maps.LatLng(latFenceMax, longFenceMax)
			));
			// bounds.extend(new google.maps.LatLng(59.341501, 18.004443));
			// bounds.extend(new google.maps.LatLng(59.309142, 18.124005));
			// map.fitBounds(bounds);
			return;
		} else {
			//  Otherwise we check where the existing markers are
	    for (var x = 0; x < viewpointArray.length; x++) {
	      //  And increase the bounds to make sure we see them all
				bounds.extend(viewpointArray[i]);
	    }
		}
	//  Fit the bounds for existing markers
	map.fitBounds(bounds);
}

var mapJson =
// [
//     {
//         "featureType": "administrative",
//         "elementType": "labels.text",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative",
//         "elementType": "labels.text.fill",
//         "stylers": [
//             {
//                 "color": "#444444"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.country",
//         "elementType": "geometry.stroke",
//         "stylers": [
//             {
//                 "visibility": "on"
//             },
//             {
//                 "color": "#000000"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.country",
//         "elementType": "labels.text",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.province",
//         "elementType": "geometry.fill",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.province",
//         "elementType": "geometry.stroke",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.province",
//         "elementType": "labels.text",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.province",
//         "elementType": "labels.text.fill",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.locality",
//         "elementType": "geometry.fill",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.locality",
//         "elementType": "geometry.stroke",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.locality",
//         "elementType": "labels.text",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.locality",
//         "elementType": "labels.text.fill",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.locality",
//         "elementType": "labels.text.stroke",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.locality",
//         "elementType": "labels.icon",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.neighborhood",
//         "elementType": "labels.text",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.neighborhood",
//         "elementType": "labels.text.fill",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.land_parcel",
//         "elementType": "labels.text",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "landscape",
//         "elementType": "all",
//         "stylers": [
//             {
//                 "color": "#ffffff"
//             }
//         ]
//     },
//     {
//         "featureType": "poi",
//         "elementType": "all",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "poi",
//         "elementType": "geometry",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "poi",
//         "elementType": "labels.text",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "road",
//         "elementType": "all",
//         "stylers": [
//             {
//                 "saturation": -100
//             },
//             {
//                 "lightness": 45
//             }
//         ]
//     },
//     {
//         "featureType": "road",
//         "elementType": "geometry.fill",
//         "stylers": [
//             {
//                 "visibility": "on"
//             },
//             {
//                 "weight": "0.70"
//             },
//             {
//                 "invert_lightness": true
//             }
//         ]
//     },
//     {
//         "featureType": "road",
//         "elementType": "geometry.stroke",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "road",
//         "elementType": "labels.text",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "road",
//         "elementType": "labels.text.fill",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "road",
//         "elementType": "labels.text.stroke",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "road",
//         "elementType": "labels.icon",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "road.highway",
//         "elementType": "all",
//         "stylers": [
//             {
//                 "visibility": "simplified"
//             }
//         ]
//     },
//     {
//         "featureType": "road.highway",
//         "elementType": "labels.text.fill",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "road.highway",
//         "elementType": "labels.text.stroke",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "road.highway",
//         "elementType": "labels.icon",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "road.highway.controlled_access",
//         "elementType": "labels.text.fill",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "road.highway.controlled_access",
//         "elementType": "labels.text.stroke",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "road.arterial",
//         "elementType": "labels.icon",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "transit",
//         "elementType": "all",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "water",
//         "elementType": "all",
//         "stylers": [
//             {
//                 "color": "#000000"
//             }
//         ]
//     }
// ];
[
    {
        "featureType": "administrative",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "weight": "0.70"
            },
            {
                "invert_lightness": true
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#F2F2F2"
            }
        ]
    }
];
