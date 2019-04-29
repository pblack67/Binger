
// var queryURL = ""

// function getTodaysShows(){
// $.ajax ({
//     url: queryURL,
//     method: "GET"
// }).then(function(response){
//     console.log(reponse);
// })

// };

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/tv/airing_today?page=1&language=en-US&api_key=504aa7272cfe840a68ff0f64c625777c",
    "method": "GET",
    "headers": {},
    "data": "{}"
  }
  
  $.ajax(settings).done(function (response) {
 
    console.log(response);
    for (var i = 0; i < response.results.length; i++){
    console.log(response.results[i].original_name);
    console.log(response.results[i].popularity);
    console.log(response.results[i].first_air_date);
    console.log(response.results[i].overview);

    $(".todayShows").append(response.results[i].original_name + "<br>");
    $(".todayShows").append(response.results[i].popularity + "<br>");
    $(".todayShows").append(response.results[i].first_air_date + "<br>");
    $(".todayShows").append(response.results[i].overview + "<br> <br>");
  

    }
  });

$(function() {
  setUserName();
});
