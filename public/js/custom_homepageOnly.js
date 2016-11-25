$("#hit").click(function () {
    var cityName = $("#cityName").val()
    console.log('city name')
    console.log(cityName)
    location.href = "/"+cityName
   console.log(location.href)
})
$("#geolocate").click(function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let lat = position.coords.latitude.toFixed(2)
            let lon = position.coords.longitude.toFixed(2)
            location.href = "/locate/" + lat + '/' + lon 
            console.log(lat,lon)
        })}
})


document.getElementById("cityName")
.addEventListener("keyup", function(event) {
event.preventDefault();
if (event.keyCode == 13) {
    document.getElementById("hit").click();
}
});  