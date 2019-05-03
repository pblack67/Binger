var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.themoviedb.org/3/tv/airing_today?page=1&language=en-US&api_key=504aa7272cfe840a68ff0f64c625777c",
  "method": "GET",
}

var currentDate = moment().format("MMMM, Do YYYY");
$(".date").text("TV Shows Airing Today: " + currentDate);

$.ajax(settings).done(function (response) {

  console.log(response);
  for (var i = 0; i < response.results.length; i++) {  
  
    if (response.results[i].original_language == "en") {
         console.log(response.results[i].original_name); 
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
        .addClass("card-action discoverAction")
        .append(moreInfo);

      var cardStackedDiv = $("<div>")
        .addClass("card-stacked")
        .append(newCardContent, newCardAction);

      var horizontal = $("<div>")
        .addClass("card horizontal divBlocks")
        .attr("id", "todayShow-" + i)
        .append(cardImageDiv, cardStackedDiv);
      $(".displayToday").append(horizontal);
      

    }

  };

  $(".displayToday").append($(".displayToday"));

});

$(function () {
  initializePage(true);
});
