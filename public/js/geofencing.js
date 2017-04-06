var lat = 59.297722;
var long = 17.991000;

var latFenceMax = lat + 0.01;
var latFenceMin = lat - 0.01;

var longFenceMax = long + 0.01;
var longFenceMin = long + 0.01;

var dbArray = [59.2984781, 18.0011404, "bajs i anus"];


function geoFenceTest() {
  if(dbArray[0] < latFenceMax && dbArray[0] > latFenceMin) {
  console.log("OK finns med i HELA lat!")
  }
  if (dbArray[1] < longFenceMax && dbArray[1] > longFenceMin) {
  console.log("YES!!!! DET ÄR EN MATCH")
  }
}
