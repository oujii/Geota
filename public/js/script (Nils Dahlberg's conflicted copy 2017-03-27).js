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

function writeDataName(message, lat, long) {
	var idName = String(lat).replace('.', ',') + '_' + String(long).replace('.', ',');
	console.log(idName);
	var rootData = firebase.database().ref('location/' + idName);
	var pushData = rootData.set({
		text: message, lat, long
	});
	var postId = pushData.key; // ??
}

// Submit form
var rootRef = firebase.database().ref();
var idArray = [];
var latArray = [];
var longArray = [];
var messageArray = [];
var baseFireArray = [];
var latFirebase;
var longFirebase;
var messageFirebase;
function buttonActivator() {
    $('#submitButton').click(function() {
        var userMessage = $("#messageField").val();
        // Writing to Firebase.
				writeDataName(userMessage, userCordsLat, userCordsLong);
				$("#messageForm")[0].reset();
			});
}

// Builds arrays from Fajahbase AND builds the markers on the map
var buttonStateHeart = true;
$(".button.Primary").click(function() {
	if (buttonStateHeart) {
		// Builds array of Lats from Fajahbase
		arrayBuilder();
		$(this).css("color", "#1ED760");
		setTimeout(function() {
	  	setMarkers();
		}, 500);
		buttonStateHeart = false;
	} else {
		$(this).css("color", "white");
		removeMarkers();
		buttonStateHeart = true;
	}
});

// Get user position
var formArray = ['<form id="messageForm" onsubmit="return false"><input type="message" id="messageField" placeholder="Enter your message"/><input type="submit" id="submitButton" value="Submit"/></form>'];
var userCordsLat;
var userCordsLong;
var userCordsCheck = false;
$(document).ready(function() {
	//Start geolocation
	if (navigator.geolocation) {

		function error(err) {
			console.warn('ERROR(' + err.code + '): ' + err.message);
			}

		function success(pos) {
			userCordsLat = pos.coords.latitude;
			userCordsLong = pos.coords.longitude;
			userCordsCheck = true;
			$(".formBox").html(formArray);
			$(".messageParent").css("display", "flex");
			$(".button.Primary").css("display", "block");
			initialize();
			buttonActivator(); // ??
			arrayBuilder();
			setTimeout(function() {
		  	geofence();
			}, 500);

      console.log("*** Found user position ***");
			}


		navigator.geolocation.watchPosition(success, error);
	}
	else {
		alert('Geolocation is not supported in your browser');
	}
});
// End of user position

// Initialize the map
function initialize() {
	var mapOptions;

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
    var userPosition = new google.maps.Marker({
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

function arrayBuilder() {
// Builds array of Longs from Fajahbase
	var longQuery = firebase.database().ref("location").orderByKey();
			longQuery.once("value").then(function (snapshot) {
					snapshot.forEach(function (childSnapshot) {
							var key = childSnapshot.key;
							var childData = childSnapshot.child('long').val();
							longArray.push(childData);
					});
	});

	// Builds array of Messages (texts) from Fajahbase
	var messageQuery = firebase.database().ref("location").orderByKey();
			messageQuery.once("value").then(function (snapshot) {
					snapshot.forEach(function (childSnapshot) {
							var key = childSnapshot.key;
							var childData = childSnapshot.child('text').val();
							messageArray.push(childData);
					});
	});

	var latQuery = firebase.database().ref("location").orderByKey();
			latQuery.once("value").then(function (snapshot) {
					snapshot.forEach(function (childSnapshot) {
							var key = childSnapshot.key;
							var childData = childSnapshot.child('lat').val();
							latArray.push(childData);
					});
	});
}

// Creates the Google Map markers
var markerStorage = [];
var firebaseLatLong = [];
function setMarkers() {
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
		google.maps.event.addListener(markerGenerator, 'click', function () {
			infowindow.setContent(this.html);
			infowindow.open(map, this);
		});
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
    for(i=0; i<markerStorage.length; i++){
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
	    for (var i = 0; i < viewpointArray.length; i++) {
	      //  And increase the bounds to make sure we see them all
				bounds.extend(viewpointArray[i]);
	    }
		}
	//  Fit the bounds for existing markers
	map.fitBounds(bounds);
}

// Creates bounds around the user position
// and crosschecks if any entry in the database
// is in it. If an object is in the bound
// we show it to the user.
function geofence() {
	// OBS! Lat max = 90, Long max = 180
	var latFenceMax = userCordsLat+0.000625;
	var latFenceMin = userCordsLat-0.000625;
	var longFenceMax = userCordsLong+0.00125;
	var longFenceMin = userCordsLong-0.00125;

	for (var i = 0; i < latArray.length; i++) {
		if(latArray[i] < latFenceMax && latArray[i] > latFenceMin) {				// ??
	  // console.log("Träff i latArray["+i+"]!");
	  }
	  if (longArray[i] < longFenceMax && longArray[i] > longFenceMin) {
	  // console.log("Träff i longArray["+i+"]!");
		$(".messageFeed").append("Message #"+i+" intercepted: "+messageArray[i]+"<br>");
	  }
	}
}
