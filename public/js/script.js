
function writeDataName(message, lat, long, trackname, artist, url, nickname) {
	// var idName = String(lat).replace('.', ',') + '_' + String(long).replace('.', ',');
	// console.log(idName);
	var rootData = firebase.database().ref('spotifaj/').push();
	var pushData = rootData.set({
		text: message, lat, long, trackname, artist, url, nickname
	});
	var postId = pushData.key;
}

// Submit form
var rootRef = firebase.database().ref();
var idArray = [];
var latArray = [];
var longArray = [];
var nicknameArray = [];
var messageArray = [];
var artistArray = [];
var songArray = [];
var songURLArray = [];
var baseFireArray = [];
var latFirebase;
var longFirebase;
var messageFirebase;

// Disables form zoom on iPhone
// $('input[type=message]').on('focus', function(){
//   // replace CSS font-size with 16px to disable auto zoom on iOS
//   $(this).data('fontSize', $(this).css('font-size')).css('font-size', '16px');
// }).on('blur', function(){
//   // put back the CSS font-size
//   $(this).css('font-size', $(this).data('fontSize'));
// });

// Sends what the user wrote to the database on click/enter
$(".submitButton").click(function() {
	var userMessage = $(".messageField").val();
	spotifyGetData(); // Get the latest Spotify data before writing to database
	setTimeout(function() {
		console.log(spotifyTrackName);
		console.log(spotifyURL);
		console.log(spotifyArtistName);
		writeDataName(userMessage, userCordsLat, userCordsLong, spotifyTrackName, spotifyArtistName, spotifyURL, spotifyUserId);

	}, 2000);

	// setTimeout(writeDataName(userMessage, userCordsLat, userCordsLong, spotifyTrackName, spotifyArtistName, spotifyURL, spotifyUserId), 1000);


	// Writing to Firebase.

	$(".messageForm")[0].reset();

});

// GET CURRENT POSITION
var userCordsLat;
var userCordsLong;
var userCordsCheck = false;
$(document).ready(function() {
	var options = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 0
	};

	function success(pos) {
	  var crd = pos.coords;
		userCordsLat = pos.coords.latitude;
		userCordsLong = pos.coords.longitude;
		userCordsCheck = true;
		// $(".loading").css("display", "none");
		$(".formBox").css("display", "flex");
		$(".messageParent").css("display", "flex");
		$(".button.Primary").css("display", "block");

		// arrayBuilder();

	  console.log('Your current position is:');
	  console.log(`Latitude : ${crd.latitude}`);
	  console.log(`Longitude: ${crd.longitude}`);
	  console.log(`More or less ${crd.accuracy} meters.`);
	}

	function error(err) {
	  console.warn(`ERROR(${err.code}): ${err.message}`);
	}

	navigator.geolocation.getCurrentPosition(success, error, options);
});
// END OF GET CURRENT POSITION

// WATCH POSITION
var currentPosition = navigator.geolocation.watchPosition(mapUpdater);

// IF NEW (WATCH)POSITION – UPDATES MAP AND MESSAGE FEED
function mapUpdater(position) {
	userCordsLat = position.coords.latitude;
  userCordsLong = position.coords.longitude;
	console.log("watchPosition lat: "+userCordsLat);
	console.log("watchPosition long: "+userCordsLong);
	// alert("New watchPosition recieved!");
	arrayBuilder();

	userMarkerLatLng = {lat: userCordsLat, lng: userCordsLong};

}
// END OF WATCH POSITION


var childDataLong;
var childDataLat;
var childDataMessage;
var childDataNickname;
var childDataSongURL;
var childDataArtist;
var childDataSong;
function arrayBuilder() {
// Clears the arrays
geofencedMessage = [];
geofencedNickname = [];
geofencedSongURL = [];
geofencedArtist = [];
geofencedSong = [];
latArray = [];
longArray = [];
messageArray = [];
nicknameArray = [];
songURLArray = [];
artistArray = [];
songArray = [];

	var latQuery = firebase.database().ref("spotifaj").orderByKey();
		latQuery.once("value").then(function (snapshot) {
			snapshot.forEach(function (childSnapshot) {
				var key = childSnapshot.key;
				childDataLat = childSnapshot.child('lat').val();
				latArray.push(childDataLat);

				childDataLong = childSnapshot.child('long').val();
				longArray.push(childDataLong);

				childDataMessage = childSnapshot.child('text').val();
				messageArray.push(childDataMessage);

				childDataNickname = childSnapshot.child('nickname').val();
				nicknameArray.push(childDataNickname);

				childDataSongURL = childSnapshot.child('url').val();
				songURLArray.push(childDataSongURL);

				childDataArtist = childSnapshot.child('artist').val();
				artistArray.push(childDataArtist);

				childDataSong = childSnapshot.child('trackname').val();
				songArray.push(childDataSong);

				geofence();
				// latArray.push(childData);
			});

	});
	setTimeout(function() {
		$(".messageFeed").html("");
		for (ixo = 0; ixo < geofencedNickname.length; ixo++) {
			$(".messageFeed").append("<b style='color:#30A793'>"+geofencedNickname[ixo]+"</b> is listening to&nbsp;<a href='"+geofencedSongURL[ixo]+"'>"+geofencedSong[ixo]+"</a> by "+geofencedArtist[ixo]+'. "'+geofencedMessage[ixo]+'"<br>');
		}
	}, 1000);
}


// Creates bounds around the user position
// and crosschecks if any entry in the database
// is in it. If an object is in the bound
// we show it to the user.
var geofencedMessage = [];
var geofencedNickname = [];
var geofencedSongURL = [];
var geofencedArtist = [];
var geofencedSong = [];
function geofence() {
	// OBS! Lat max = 90, Long max = 180
	var latFenceMax = userCordsLat+0.000625;
	var latFenceMin = userCordsLat-0.000625;
	var longFenceMax = userCordsLong+0.00125;
	var longFenceMin = userCordsLong-0.00125;

	if(childDataLat < latFenceMax && childDataLat > latFenceMin) {
		if (childDataLong < longFenceMax && childDataLong > longFenceMin) {
			geofencedMessage.push(childDataMessage);
			geofencedNickname.push(childDataNickname);
			geofencedSongURL.push(childDataSongURL);
			geofencedArtist.push(childDataArtist);
			geofencedSong.push(childDataSong);

	  }
	 }
}

firebase.database().ref("spotifaj").on("child_added", function(snapshot, prevChildKey) {
	arrayBuilder();
});
