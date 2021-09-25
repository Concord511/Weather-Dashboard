let searchedCities = [];
let cityId = 0;
let cityName = "";
let apiKey = "8e06cacfe4c21ba33aa0579afd1ec839";
let DateTime = luxon.DateTime;
let now = DateTime.now();
let today = now.month + "/" + now.day + "/" + now.year;

// button click handler
$(".search-button").on("click", function(event) {
    cityName = $("#user-input").val().trim();
    if (cityName) {
        apiCityRequest(cityName);
    }
});

// button click handler
$(".history-container").on("click", ".history-item", function(event) {
    cityName = $(this).text().trim();
    if (cityName) {
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
        + apiKey
    )
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // as long as the city doesn't already exist in the array- add it
                addCity(cityName);
                let latitude = data.coord.lat;
                let longitude = data.coord.lon;
                apiForecastRequest(latitude, longitude);
            });
        }
        else {
            response.json().then(function(data) {
                alert("Error: " + data.message);
            })
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
        + apiKey
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

// function to pull data out of the API response and assign values to elements
const renderData = function(data) {
    // iterate through the display cards
    for (let i = 0; i < 6; i++) {
        // for the "0-day" element
        if (i === 0) {
            // set city name and today's date
            $("#0-day-city-date").text(cityName + " (" + today + ")");

            // set img element's source to icon URL
            $("#0-day-icon").remove();
            let imageEl = $("<img>")
                .attr("id", "0-day-icon")
                .addClass("card-icon");
            let imageURL = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png";
            imageEl.attr("src", imageURL);
            $("#0-day").children(".main-append-here").append(imageEl);

            // set temp, wind, humidity, and uv index
            $("#0-day-temp").text("Temp: " + data.current.temp + "\u00B0F");
            $("#0-day-wind").text("Wind: " + data.current.wind_speed + " MPH");
            $("#0-day-humidity").text("Humidity: " + data.current.humidity + " %");
            
            // Logic to remove all old classes and add new one!
            
            let uvEl = $("<span>");
            let uvIndex = parseInt(data.current.uvi);
            uvEl.text(uvIndex);
            if (uvIndex <= 2) {
                uvEl.addClass("uv-low");
            }
            else if (uvIndex > 2 && uvIndex <= 5) {
                uvEl.addClass("uv-medium");
            }
            else if (uvIndex > 5 && uvIndex <= 7) {
                uvEl.addClass("uv-high");
            }
            else if (uvIndex > 7 && uvIndex <= 11) {
                uvEl.addClass("uv-very-high");
            }
            else if (uvIndex > 11) {
                uvEl.addClass("uv-extreme");
            }
            $("#0-day-uv").append(uvEl);
        }
        // for the other #d elements
        else {
            // set new date
            let newDate = now.plus({ days: i });
            $("#" + i + "-day-date").text(newDate.month + "/" + newDate.day + "/" + newDate.year);

            // set img element's source to icon URL
            $("#" + i + "-day-icon").remove();
            let imageEl = $("<img>")
                .attr("id", i + "-day-icon")
                .addClass("card-icon");
            let imageURL = "http://openweathermap.org/img/wn/" + data.daily[i-1].weather[0].icon + ".png";
            imageEl.attr("src", imageURL);
            $("#" + i + "-day").children(".append-here").append(imageEl);

            // set temp, wind, and humidity
            $("#" + i + "-day-temp").text("Temp: " + data.daily[i-1].temp.day + "\u00B0F");
            $("#" + i + "-day-wind").text("Wind: " + data.daily[i-1].wind_speed + " MPH");
            $("#" + i + "-day-humidity").text("Humidity: " + data.daily[i-1].humidity + " %");
        }
    }
}

// adds a city to the searchedCities array and then calls the render function and save function
const addCity = function(city) {
    if (searchedCities.indexOf(city) === -1) {
        searchedCities.push(city);
        while (searchedCities.length > 10) {
            searchedCities.splice(0, 1);
        }
        renderCities(searchedCities);
        saveCities(searchedCities);
    }
}

// renders the array of searched cities
const renderCities = function(cityArr) {
    let historyContainerEl = $(".history-container");
    historyContainerEl.children().remove();
    for (let i = 0; i < cityArr.length; i++) {
        let cityEl = $("<div>")
            .addClass("history-item")
            .text(cityArr[i]);
        historyContainerEl.append(cityEl);
    }
}

// saves the array of searched cities in localStorage
const saveCities = function(cityArr) {
    localStorage.setItem("cities", JSON.stringify(cityArr));
}

// load the array of searched cities from localStorage
const loadCities = function() {
    searchedCities = JSON.parse(localStorage.getItem("cities"));
    if (!searchedCities) {
        searchedCities = [];
    }
    else {
        renderCities(searchedCities);
    }
}

loadCities();