//https://github.com/jpd61/weather-dashboard
//Setup global Variables
//Url query to weather map

//Key API for weather map
var keyApi="229a7a738ad9ea48cbd912a9e33b713d";
//Other variable
var currentCity="";
var lastCity="";

//Function to retrieve Weather information
function populaCurrenteWeather()
{    var city = $('#search-city').val();
    var queryPopulateWeather="https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + keyApi;
    $.ajax({
		url:queryPopulateWeather,
    	method: "GET"
		 })
		 
	.done(function(WeatherData) {
        console.log(WeatherData);
        // Get icon for current weather
        var currentWeatherIcon="https://openweathermap.org/img/w/" + WeatherData.weather[0].icon + ".png";
        // Offset UTC timezone - using moment.js
        var currentTimeUTC = WeatherData.dt;
        var currentTimeZoneOffset = WeatherData.timezone;
        var currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
        var currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);

        // Create HTML elements for the results of search
        var cityName=$("<h3>");
         cityName.html(`${WeatherData.name} ${currentMoment.format("(MM/DD/YY)")}<img src="${currentWeatherIcon}">`);
         var CityWeather=$("<ul>");
         CityWeather.addClass("list-unstyled");
         var temp=$("<li>");
         var humidity=$("<li>");
         var speed=$("<li>");
         var uv=$("<li>");
         uv.attr("id","uvIndex");
         temp.html(`Temperature: ${WeatherData.main.temp}&#8457;`);
         humidity.html(`Humidity: ${WeatherData.main.humidity}%`)
         speed.html(`Wind Speed: ${WeatherData.wind.speed} mph`);
         uv.html(`UV Index:`);

         //Append Elements to the DOM
         $("#current-weather").empty();
         CityWeather.append(temp);
         CityWeather.append(humidity);
         CityWeather.append(speed);
         CityWeather.append(uv);
         $("#current-weather").append(cityName);
         $("#current-weather").append(CityWeather);

          // Get the latitude and longitude for the UV search 
        var latitude = WeatherData.coord.lat;
        var longitude = WeatherData.coord.lon;
        var uvQueryURL = "api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=" + keyApi;
        uvQueryURL = "https://cors-anywhere.herokuapp.com/" + uvQueryURL;
        $.ajax({
            url: uvQueryURL,
            method: "GET"
             })
             
        .done(function(uvData) {
            console.log(uvData);
            var uvIndex = uvData.value;
            $('#uvIndex').html(`UV Index: <span id="uvVal"> ${uvIndex}</span>`);
            if (uvIndex>=0 && uvIndex<3){
                $('#uvVal').attr("class", "uv-favorable");
            } else if (uvIndex>=3 && uvIndex<8){
                $('#uvVal').attr("class", "uv-moderate");
            } else if (uvIndex>=8){
                $('#uvVal').attr("class", "uv-severe");
            }
            });
                
});
}

$("#search-button").on("click",function(){
    event.preventDefault();
    populaCurrenteWeather();
});