// Espisodate show search API endpoint
var showSearchURL = "https://www.episodate.com/api/search?q=" // yourshowhere&page=1"
var showSearchSuffix = "&page=1";
var showSearchDetailsURL = "https://www.episodate.com/api/show-details?q="
var searchOmdbURL = "https://www.omdbapi.com/?apikey=f8e29b5&t=";
var wikipediaURL = "https://en.wikipedia.org/wiki/";

function searchShowButtonClicked() {
    console.log("searchShowButtonClicked");
    var show = $("#showText").val();
    console.log("Searching for", show);
    var myURL = showSearchURL + show + showSearchSuffix;
    $.get(myURL).then(function (response) {
        console.log(response);
        var resultOBJ = JSON.parse(response);
        var resultText = JSON.stringify(resultOBJ, null, 2);

        var showText = "";
        resultOBJ.tv_shows.forEach(function (tvShow) {
            showText += tvShow.name;
            showText += " (";
            showText += tvShow.network;
            showText += ")\n"
        });

        resultText = showText + resultText;

        console.log(resultText);
        $("#searchShowResults").text(resultText);

    });
}

function searchShowDetailsButtonClicked() {
    console.log("searchShowDetailsButtonClicked");
    var show = $("#showDetailsText").val();
    console.log("Searching for", show);
    var myURL = showSearchDetailsURL + show;
    var resultText = "";
    $.get(myURL).then(function (response) {
        var resultOBJ = JSON.parse(response);
        if (resultOBJ.tvShow.length !== undefined) {
            resultText = "I couldn't find it";
        } else {
            resultText = JSON.stringify(resultOBJ, null, 2);

            var nameNetwork = resultOBJ.tvShow.name + "(" + resultOBJ.tvShow.network + ")\n"
            var episodeText = "";
            resultOBJ.tvShow.episodes.forEach(function (episode) {
                episodeText += "Season: " + episode.season
                episodeText += ", Episode: " + episode.episode
                episodeText += ", Name: " + episode.name
                episodeText += "\n";
            });

            resultText = nameNetwork + episodeText + resultText;
        }
        console.log(resultText);
        $("#searchShowDetailsResults").text(resultText);

    });
}

function searchOMDBButtonClicked() {
    console.log("searchOMDBButtonClicked");
    var show = $("#showOMDBText").val();
    console.log("Searching for", show);
    var myURL = searchOmdbURL + show;
    $.get(myURL).then(function (response) {
        console.log(response);
        // for some reason this one comes back as an object. Weird.
        var resultText = JSON.stringify(response, null, 2);
        console.log(resultText);
        $("#searchOMDBResults").text(resultText);

        // turn the actors into Wikipedia links. It works!
        var actors = response.Actors.split(",");
        console.log(actors);
        actors.forEach(function (actor) {
            actor = actor.trim().replace(" ", "_");
            console.log(actor);
            var anchor = $("<a>")
                .attr("href", wikipediaURL + actor)
                .attr("target", "_blank")
                .text(actor);
            var div = $("<div>").append(anchor);
            $("#searchOMDBResults").append(div);
        });
    });
}

$(function () {
    $("#searchShowButton").on("click", searchShowButtonClicked);
    $("#searchShowDetailsButton").on("click", searchShowDetailsButtonClicked);
    $("#searchOMDBButton").on("click", searchOMDBButtonClicked);
});
