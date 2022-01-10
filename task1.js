//variables
let map;
let myLocation;
let arr = [];
var text = document.getElementById("jsdata");
var radioBoxValues = document.getElementsByName("secondLoc");
//check if local storage already exists
if (localStorage.getItem("Current Location")) {
  arr = JSON.parse(localStorage.getItem("Current Location"));
  arr.forEach((element) => addToTable(element));
} else arr = [];
//function to calculate distance between two points
function calculatingDistance(loc1, loc2) {
  var R = 3958.8; // Radius of the Earth in miles
  var rlat1 = loc1.lat * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = loc2.lat * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (loc2.lng - loc1.lng) * (Math.PI / 180); // Radian difference (longitudes)

  var d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );
  return d;
}
//main function
var buttonClick = document.getElementById("map-button");
buttonClick.addEventListener("click", () => {
  buttonClick.disabled = true;
  buttonClick.style.backgroundColor = "white";
});
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: myLocation,
  });
  navigator.geolocation.watchPosition(
    (pos) => {
      // console.log(pos.coords.latitude);
      // console.log(pos.coords.longitude);
      // console.log(arr);
      myLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      if (
        arr.every((element) => calculatingDistance(myLocation, element) >= 0.5)
      ) {
        arr.push(myLocation);
        addToTable(myLocation);
      }
      map.setCenter(myLocation);
      localStorage.setItem("Current Location", JSON.stringify(arr));
      arr.forEach((element) => {
        new google.maps.Marker({
          position: element,
          map,
        });
      });
      // controling radiobox
      radioBoxValues.forEach((e) =>
        e.addEventListener("click", () => {
          console.log(e.value);
        })
      );
    },
    error,
    options
  );
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
var options = {
  enableHighAccuracy: false,
  timeout: 2000,
  maximumAge: 0,
};

function addToTable(locationObj) {
  text.innerHTML += `<tr>
  <td>Location:</td>
  <td>Lat: ${locationObj.lat}</td><td>Lng: ${locationObj.lng}</td></tr>`;
}

//<td><input type="radio" name="secondLoc" value="{Lat: ${locationObj.lat}, Lng: ${locationObj.lng}}" /></td>

//timeout member
//The timeout member denotes the maximum length of time, expressed in milliseconds, before acquiring a position expires.

//maximumAge member
//The maximumAge member indicates that the web application is willing to accept a cached position
// whose age is no greater than the specified time in milliseconds.
