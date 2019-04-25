// Espisodate show search API endpoint
var showSearchURL = "https://www.episodate.com/api/search?q=" // yourshowhere&page=1"
var showSearchSuffix = "&page=1";
var showSearchDetailsURL = "https://www.episodate.com/api/show-details?q="
var searchOmdbURL = "https://www.omdbapi.com/?apikey=f8e29b5&t=";
var wikipediaURL = "https://en.wikipedia.org/wiki/";
var movieDBAPI = "https://api.themoviedb.org/3/";
var movieDBAPISuffix = "?api_key=29a27fe8b3f85bad1ab054a647529d57";
var movieDBAPISourceSuffix = "&external_source=imdb_id";


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

function searchMovieDBButtonClicked() {
    console.log("searchMovieDBButtonClicked");
    var id = $("#showMovieDBText").val();
    console.log("Searching for", id);
    var myURL = movieDBAPI + "find/" + id + movieDBAPISuffix + movieDBAPISourceSuffix;
    console.log(myURL);
    $.get(myURL).then(function (response) {
        console.log(response);
        var resultText = JSON.stringify(response, null, 2);
        console.log(resultText);
        $("#searchMovieDBResults").text(resultText);
    });
}

function searchMovieDBDetailsButtonClicked() {
    console.log("searchMovieDBDetailsButtonClicked");
    var id = $("#showMovieDBDetailsText").val();
    console.log("Searching for", id);
    var myURL = movieDBAPI + "tv/" + id + movieDBAPISuffix;
    console.log(myURL);
    $.get(myURL).then(function (response) {
        console.log(response);
        var resultText = JSON.stringify(response, null, 2);
        console.log(resultText);
        $("#searchMovieDBDetailsResults").text(resultText);
    });
}

function searchMovieDBEpisodeButtonClicked() {
    console.log("searchMovieDBEpisodeButtonClicked");
    var id = $("#showMovieDBEpisodeText").val();
    console.log("Searching for", id);
    var myURL = movieDBAPI + "tv/" + id + "/season/1/episode/1" + movieDBAPISuffix;
    console.log(myURL);
    $.get(myURL).then(function (response) {
        console.log(response);
        var resultText = JSON.stringify(response, null, 2);
        console.log(resultText);
        $("#searchMovieDBEpisodeResults").text("Overview: " + response.overview + "\n" + resultText);
    });
}

var shows = [];
var currentShow = {};

function addEpisodeWidgets(episodes) {
    console.log("addEpisodeWidgets");
    // TODO Create episode widgets here and dynamically add to html
    // For now, populate the API page results
    var resultText = "";
    episodes.forEach(function (episode) {
        resultText += ("Show: "
            + currentShow.name
            + ", Network: "
            + currentShow.network
            + ", Season: "
            + episode.seasonNumber
            + ", Episode: "
            + episode.episodeNumber
            + ", Name: "
            + episode.name
            + ", Description: "
            + episode.description
            + "\n");
    });
    $("#generateEpisodesResults").text(resultText);
}

function isAllEpisodesDownloaded(episodes) {
    var result = true;
    episodes.forEach(function (episode) {
        if (episode.name == undefined) {
            result = false;
        }
    });
    return result;
}

// Requires use of global variable currentShow
function getEpisodes(showName, seasonNumber) {
    console.log("Get episodes for season", seasonNumber, " of ", showName);
    var show = findShow(showName);
    if (show !== null) {
        currentShow = show;
        var season = show.seasons[seasonNumber - 1];
        for (var i = 0; i < season.episodeCount; i++) {
            var myURL = movieDBAPI
                + "tv/"
                + currentShow.tmdbID
                + "/season/"
                + season.seasonNumber
                + "/episode/"
                + (i + 1)
                + movieDBAPISuffix;
            console.log(myURL);
            $.get(myURL).then(function (response) {
                console.log(response);
                var myEpisode = {
                    name: response.name,
                    episodeNumber: response.episode_number,
                    seasonNumber: response.season_number,
                    description: response.overview
                }
                var episodes = currentShow.seasons[response.season_number - 1].episodes;
                episodes[response.episode_number - 1] = myEpisode;
                console.log("Episode", episodes[response.episode_number - 1]);
                if (isAllEpisodesDownloaded(episodes)) {
                    addEpisodeWidgets(episodes);
                }
            });
        }
    } else {
        console.log("Can't find " + showName);
    }
}

function findShow(showName) {
    var myShow = null;
    shows.forEach(function (show) {
        if (showName === show.name) {
            myShow = show;
            console.log("Found the show!");
        }
    });
    return myShow;
}

function addSeasonWidgets(show) {
    // TODO Remove this for production code
    // TODO Create season widgets here and dynamically add to html
    // For now, populate the API page results
    var resultText = "";
    show.seasons.forEach(function (season) {
        resultText += (season.seasonName
            + ", Episodes "
            + season.episodeCount
            + ", Description: "
            + season.description
            + "\n");
    });
    $("#generateSeasonListResults").text(resultText);
}

// Load the seasons, iterate each season to get the episode info 
function getSeasonDetails(tmdbID) {
    console.log("getSeasonDetails");
    var myURL = movieDBAPI + "tv/" + tmdbID + movieDBAPISuffix;
    console.log(myURL);
    $.get(myURL).then(function (response) {
        console.log("Show", response);

        // TODO put in duplicate protection
        var show = findShow(response.name);

        if (show === null) {

            // Create the show
            show = {
                tmdbID: tmdbID,
                name: response.name,
                network: response.networks[0].name,
                description: response.overview,
                seasons: []
            };

            // Create seasons
            response.seasons.forEach(function (season) {
                // Doctor Who has a season zero for specials. 
                // Could rewite with a search for a season, but keeping it as a straight index for now.
                if (season.season_number > 0) {
                    var mySeason = {
                        seasonName: season.name,
                        seasonNumber: season.season_number,
                        description: season.overview,
                        episodeCount: season.episode_count,
                        episodes: []

                    };
                    // Create dummy episodes so that async reponses can access cleanly
                    for (var i = 0; i < mySeason.episodeCount; i++) {
                        mySeason.episodes.push({});
                    }

                    console.log("Season:", mySeason);
                    show.seasons.push(mySeason);
                }
            });

            console.log(show);
            shows.push(show);
        }
        addSeasonWidgets(show);
    });
}

function getTMDBIDAndSeasons(imdbidID) {
    console.log("getTMDBIDAndSeasons");
    var myURL = movieDBAPI + "find/" + imdbidID + movieDBAPISuffix + movieDBAPISourceSuffix;
    console.log(myURL);
    $.get(myURL).then(function (response) {
        console.log(response);
        // Now I've got the TMBD ID and can conquer the world
        var result = response.tv_results[0];
        if (result !== undefined) {
            var tmdbID = result.id;
            console.log("TMBD ID:", tmdbID);
            getSeasonDetails(tmdbID);
        }
    });
}

// Get the IMDB ID from the OMDB so we can use TMDB. Got it?
function generateSeasonListButtonClicked() {
    console.log("generateSeasonListButtonClicked");
    var show = $("#generateSeasonListText").val().trim();
    console.log("Searching for", show);
    var myURL = searchOmdbURL + show;
    console.log(myURL);
    $.get(myURL).then(function (response) {
        console.log(response);
        console.log("IMDB ID:", response.imdbID);
        // var resultText = JSON.stringify(response, null, 2);
        // console.log(resultText);

        // I now have the IMDB ID, fire another ajax to get the TMDB ID
        getTMDBIDAndSeasons(response.imdbID);
    });
}

function dumpShowsButtonClicked() {
    shows.forEach(function (show) {
        console.log(show);
    });
}

function generateEpisodesButtonClicked(event) {
    event.preventDefault();
    var showName = $("#episodeShowName").val().trim();
    var seasonNumber = $("#episodeSeason").val().trim();
    getEpisodes(showName, seasonNumber);
}

$(function () {
    $("#searchShowButton").on("click", searchShowButtonClicked);
    $("#searchShowDetailsButton").on("click", searchShowDetailsButtonClicked);
    $("#searchOMDBButton").on("click", searchOMDBButtonClicked);
    $("#searchMovieDBButton").on("click", searchMovieDBButtonClicked);
    $("#searchMovieDBDetailsButton").on("click", searchMovieDBDetailsButtonClicked);
    $("#searchMovieDBEpisodeButton").on("click", searchMovieDBEpisodeButtonClicked);
    $("#generateSeasonListButton").on("click", generateSeasonListButtonClicked);
    $("#dumpShowsButton").on("click", dumpShowsButtonClicked);
    $("#generateEpisodesButton").on("click", generateEpisodesButtonClicked);
});
