var place;
var hist;



// render events to page or create storage for events if no event array exists
function renderHistory(){
    hist = JSON.parse(localStorage.getItem("hist"));
    if( hist === null){
        hist = [];
        localStorage.setItem("hist", JSON.stringify(hist));
    } else { 
        for( var i = 0; i < hist.length; i++){
            $("#history").append(`<li><a href="#!" class="histEl">${hist[i]}</a></li>`);
        }
        // this sets place to most recent location in history then renders weather based on it
        place = hist[0];
        renderCurrentWeather();
        renderForcast();
    };
};
renderHistory();




// submit Button listener---------------------------
$("#submit").click(function(){
    if(document.getElementById("place").value == ""){
        // prevents a blank submission from rendering nothing and adding a blank spot to history
    } else{
        place = document.getElementById("place").value;
        $("#history").prepend(`<li><a href="#!" class="histEl" value="${place}">${place}</a></li>`);
        hist.unshift(place);
        localStorage.setItem("hist", JSON.stringify(hist));
        renderCurrentWeather();
        renderForcast();
    };
});
// History button listeners -------------------------
$(document).on('click', '.histEl', function(){
    place = event.toElement.text
    renderCurrentWeather();
    renderForcast();
});


// API Call Functions ---------------------------------
// renders 5 day forcast cards
function renderForcast(){
    $.ajax({
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=b260ec26d45927cb9a1279afb667811f`,
            method: "GET"
        }).then(function(response) {
            var fiveDayItems = [3, 11, 19, 27, 35]
            for(var i = 0; i < fiveDayItems.length; i++){
                var date = response.list[fiveDayItems[i]].dt_txt.slice(0, 10).split("-")
                var icon = `https://openweathermap.org/img/wn/${response.list[fiveDayItems[i]].weather[0].icon}@2x.png`
                var temp = ((response.list[fiveDayItems[i]].main.temp - 273.15) * 9/5 + 32).toFixed(2)
                var humidity = response.list[fiveDayItems[i]].main.humidity
                // empty the rerender forcast based on origin of function run
                $("#day"+(i+1)).empty()
                $("#day"+(i+1)).append(`
                <div class="card center blue darken-1">
                    <div class="card-content white-text">
                    <p class="nudge">${date[1]+"/"+date[2]+"/"+date[0]}</p>
                    <img src="${icon}" class="move" alt="weather icon">
                    <p>Temp ${temp}f</p>
                    <p>Humidity ${humidity}</p>
                    </div>
                </div>
                `)
            }
    });
}
// renders primary weather card for current day
function renderCurrentWeather(){
    // api call for current weather
    $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=b260ec26d45927cb9a1279afb667811f`,
            method: "GET"
        }).then(function(response) {
            var lat = response.coord.lat
            var lon = response.coord.lon
            var uvi = ""
            var temp = ((response.main.temp - 273.15) * 9/5 + 32).toFixed(2)
            var icon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
            var humidity = response.main.humidity
            var wind = response.wind.speed
            // current weather gives lat/lon for uvi call to get date and uvi
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/uvi?appid=b260ec26d45927cb9a1279afb667811f&lat=${lat}&lon=${lon}`,
                method: "GET"
                }).then(function(response) {
                    var date = response.date_iso.slice(0, 10).split("-")
                    uvi = response.value
                    // empties then adds current weather based on origin of function run
                    $("#current-weather").empty();
                    $("#current-weather").append(`
                    <div class="container">
                        <div class="row">
                            <div class="col s12">
                                <div class="card blue lighten-2">
                                    <div class="card-content white-text">
                                        <span class="card-title">
                                            <h5 id="city">${place}</h5>
                                            <h6 id="Date">${date[1]+"/"+date[2]+"/"+date[0]}</h6>
                                        </span>
                                        <img class="right" src="${icon}" alt="weather icon">
                                        <h5>Temp = ${temp}f</h5>
                                        <h5>Humidity = ${humidity}</h5>
                                        <h5>Wind Speed = ${wind} mph</h5>
                                        <h5>UV index = <span id="uvi">${uvi}</span></h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`)
                    // sets uv index background
                    if(uvi > 6){
                        $("#uvi").addClass("red")
                    }else if(uvi < 4){
                        $("#uvi").addClass("green")
                    }else{
                        $("#uvi").addClass("orange")
                    }
            });
    });
};