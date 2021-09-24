$(".search-button").on("click", function(event) {
    console.log("I was clicked.");
    let cityName = $("#user-input").val().trim();
    console.log(cityName);
    if (cityName) {
        console.log("Making API Request with param: " + cityName);
        apiRequest(cityName);
    }
});

const apiRequest = function(cityName) {
    fetch(
        "https://api.openweathermap.org/data/2.5/forecast?q="
        + cityName
        + "&appid=503644036b5f2350595bb60282c16eea"
    )
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                renderData(data);
            })
        }
        else {
            console.log("Error: " + response);
        }
    })
    .catch(function(error) {
        console.log('Unable to connect to GitHub');
    });
};

const renderData = function(data) {

}