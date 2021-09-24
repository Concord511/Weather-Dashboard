let cityName = "";
let day = Date.prototype.getDate();
let month = Date.prototype.getMonth();
let year = Date.prototype.getFullYear();
let date = month + "/" + day + "/" + year;
console.log(date);

$(".search-button").on("click", function(event) {
    console.log("I was clicked.");
    cityName = $("#user-input").val().trim();
    console.log(cityName);
    if (cityName) {
        console.log("Making API Request with param: " + cityName);
        apiCityRequest(cityName);
    }
});

// API request to get the City and extract latitude and longitude data
const apiCityRequest = function(cityName) {
    // call API for current weather data
    fetch(        
        "https://api.openweathermap.org/data/2.5/weather?q="
        + cityName
        + "&units=imperial&appid="
    )
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                let latitude = data.coord.lat;
                let longitude = data.coord.lon;
                apiForecastRequest(latitude, longitude);
            });
        }
        else {
            console.log("Error: " + response);
        }
    })
    .catch(function(error) {
        alert('Unable to connect to GitHub');
    });
};

// API request to get forecast using latitude and longitude from first API request
const apiForecastRequest = function(lat, lon) {
    // call API for forecasted weather data
    fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat="
        + lat
        + "&lon="
        + lon
        + "&exclude=minutely,hourly,alerts&units=imperial&appid="
    )
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                renderData(data);
            });
        }
        else {
            console.log("Error: " + response);
        }
    })
    .catch(function(error) {
        alert('Unable to connect to GitHub');
    });
};

const renderData = function(data) {
    console.log("City Name: " + cityName);
    console.log("Date: " + date);
    console.log("Temp: " + data.current.temp)
    console.log("Wind: " + data.current.wind_speed + "MPH");
    console.log("Humidity: " + data.current.humidity + "%");
}