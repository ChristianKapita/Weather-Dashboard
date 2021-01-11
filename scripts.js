
//Setup global Variables
//Key API for weather map
var keyApi="229a7a738ad9ea48cbd912a9e33b713d";
//Other variable
var currentCity="";
var lastCity="";

//Function to retrieve Weather information
function populaCurrenteWeather()
{    var city = $('#search-city').val();
         currentCity=$('#search-city').val();
         saveCity(city);
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
function populateFiveDaysWeather(){
    var city = $('#search-city').val();
    // Set up URL for API search using forecast search
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=" + keyApi;
    // Fetch from API
    $.ajax({
		url:queryURL,
    	method: "GET"
		 })
		 
	.done(function(fiveDaysWeather) {
        console.log(fiveDaysWeather);
        // Create HTML ellements
        var h2title=$("<h2>");
        h2title.text("5-Day Forecast:");
        var divFiveWeather=$("<div>");
        divFiveWeather.attr("id","fiveDayForecastUl");
        divFiveWeather.attr("class","d-inline-flex flex-wrap");
        // Loop over the 5 day forecast and build the template HTML using UTC offset and Open Weather Map icon
        for (var i = 0; i < fiveDaysWeather.list.length; i++) {
            var dayData = fiveDaysWeather.list[i];
            var dayTimeUTC = dayData.dt;
            var timeZoneOffset = fiveDaysWeather.city.timezone;
            var timeZoneOffsetHours = timeZoneOffset / 60 / 60;
            var thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetHours);
            var iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
            // Only displaying mid-day forecasts
            if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
            var divcard=$("<div>");
            divcard.addClass("weather-card card m-2 p0");
            var ulW=$("<ul>");
            ulW.addClass("list-unstyled p-3");
            var liTime=$("<li>");
            liTime.text(`${thisMoment.format("MM/DD/YY")}`);
            var liImg=$("<li>");
            liImg.addClass("weather-icon");
            liImg.html(`<img src="${iconURL}">`);
            var liTemp=$("<li>");
            liTemp.html(`${dayData.main.temp}&#8457;`);
            var liHum=$("<li>");
            liHum.text(`${dayData.main.humidity}%`);
            $('#five-day-forecast').empty();
            ulW.append(liTime);
            ulW.append(liImg);
            ulW.append(liTemp);
            ulW.append(liHum);
            divcard.append(ulW);
            divFiveWeather.append(divcard);
            }
        }
        // Build the HTML template
        //fiveDayForecastHTML += `</div>`;
        // Append the five-day forecast to the DOM
        $('#five-day-forecast').append(h2title);
        $('#five-day-forecast').append(divFiveWeather);

    })
}
// Function to save  city in local storage
function saveCity(city)
{
    var cityExists = false;
    // Check if City exists in local storage
    for (i = 0; i < localStorage.length; i++) {
        if (localStorage["cities" + i] === city) {
            cityExists = true;
            break;
        }
    }
    // Save to localStorage if city is new
    if (cityExists === false) {
        localStorage.setItem('cities' + localStorage.length, city);
    }
}

//Function to render list of saved cities
 function renderCities()
 {

    $('#city-results').empty();
    // If localStorage is empty
    if (localStorage.length===0){
        if (lastCity){
            $('#search-city').attr("value", lastCity);
        } else {
            $('#search-city').attr("value", "Ottawa");
        }
    } else {
        // Build key of last city written to localStorage
        var lastCityKey="cities"+(localStorage.length-1);
        lastCity=localStorage.getItem(lastCityKey);
        // Set search input to last city searched
        $('#search-city').attr("value", lastCity);
        // Append stored cities to page
        for (var i = 0; i < localStorage.length; i++) {
            var city = localStorage.getItem("cities" + i);
            var cityEl;
            // Set to lastCity if currentCity not set
            if (currentCity===""){
                currentCity=lastCity;
            }
            // Set button class to active for currentCity
            if (city === currentCity) {
                cityEl = `<button type="button" class="list-group-item list-group-item-action active">${city}</button></li>`;
                // var cityEl=$("<li>");
                // var btnCiy=$("<button>");
                // btnCiy.attr("type","button");
                // btnCiy.addClass("list-group-item list-group-item-action active");
                // btnCiy.text(city);
                // cityEl.append(btnCiy);
            } 
            else {
                cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
                // var cityEl=$("<li>");
                // var btnCiy=$("<button>");
                // btnCiy.attr("type","button");
                // btnCiy.addClass("list-group-item list-group-item-action");
                // btnCiy.text(city);
                // cityEl.append(btnCiy);
            } 
            // Append city to page
            $('#city-results').prepend(cityEl);
        }
        // Add a "clear" button to page if there is a cities list
        if (localStorage.length>0){
            $('#clear-storage').html($('<a id="clear-storage" href="#">clear</a>'));
        } else {
            $('#clear-storage').html('');
        }
    }
 }
//Search new City
$("#search-button").on("click",function(){
    event.preventDefault();
    populaCurrenteWeather();
    populateFiveDaysWeather(); 
    renderCities();
    
});

//Search existing City
$('#city-results').on("click", (event) => {
    event.preventDefault();
    $('#search-city').val(event.target.textContent);
    currentCity=$('#search-city').val();
    populaCurrenteWeather();
    populateFiveDaysWeather(); 
    renderCities();
});

//Clear existing cities from Local storage
$("#clear-storage").on("click", function() {
    localStorage.clear();
    renderCities();
});

renderCities();
populaCurrenteWeather();
populateFiveDaysWeather(); 
