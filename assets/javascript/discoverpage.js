
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
    //"headers": {},
    //"data": "{}"
  }
  
  $.ajax(settings).done(function (response) {
 
    console.log(response);
    for (var i = 0; i < response.results.length; i++){
        if (response.results[i].original_language == "en"){
    console.log(response.results[i].original_name);
    console.log(response.results[i].popularity);
    console.log(response.results[i].first_air_date);
    console.log(response.results[i].overview);

    // $(".todayShows").append(response.results[i].original_name + "<br>");
    // $(".todayShows").append(response.results[i].popularity + "<br>");
    // $(".todayShows").append(response.results[i].first_air_date + "<br>");
    // $(".todayShows").append(response.results[i].overview + "<br> <br>");
    var image = $("<img>")
        .addClass("image-sized")
        .attr("src", "https://image.tmdb.org/t/p/w154" + response.results[i].poster_path);
    var cardImageDiv = $("<div>")
        .addClass("card-image")
        .append(image);

    var discoverContent = $("<p>").text(response.results[i].overview);

    var newCardContent = $("<div>")
        .addClass("card-content")
        .append(discoverContent);

    var moreInfo = $("<p>").text(response.results[i].original_name);

    var newCardAction = $("<div>")
        .addClass("card-action")
        .append(moreInfo);

    var cardStackedDiv = $("<div>")
    .addClass("card-stacked")
    .append(newCardContent, newCardAction);

     var horizontal = $("<div>")
     .addClass("card horizontal divBlocks")
     .append(cardImageDiv, cardStackedDiv) 
     $(".displayToday").append(horizontal);  
     
    }};
    
    
    $(".displayToday").append($(".displayToday"));
    

  });

$(function() {
  setUserName();
});
