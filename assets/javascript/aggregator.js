
// Espisodate show search API endpoint
var showSearchURL = "https://www.episodate.com/api/search?q=" // yourshowhere&page=1"
var showSearchSuffix = "&page=1";
var showSearchDetailsURL = "https://www.episodate.com/api/show-details?q="
var searchOmdbURL = "https://www.omdbapi.com/?apikey=f8e29b5&t=";
var wikipediaURL = "https://en.wikipedia.org/wiki/";
var movieDBAPI = "https://api.themoviedb.org/3/";
var movieDBAPISuffix = "?api_key=29a27fe8b3f85bad1ab054a647529d57";
var movieDBAPISourceSuffix = "&external_source=imdb_id";
var movieDBPictureAPI = "https://image.tmdb.org/t/p/w300";

var shows = [];
var currentShow = {};
var watchList = [];

//need to update with materialize classes
//function gets CastList and displays on either Search or Episode Page
//Data should appear on the left side of main content, next to search results
//or next to the episodes list. 
function generateCastList(id) {
    var myURL = movieDBAPI + "tv/" + id + "/credits" + movieDBAPISuffix;
    console.log(myURL);
    $("#castList").empty();
    $.get(myURL).then(function (response) {
        console.log(response);
        var list = $("<ul>");
        response.cast.forEach(function (role) {
            var actorURL = wikipediaURL + role.name.trim().replace(" ", "_");
            
            var actorAnchor = $("<a>")
                .attr("href", actorURL)
                .attr("target", "_blank")
                .text(role.name);
            var characterDiv = $("<li>").text(role.character + ": ");
            characterDiv.append(actorAnchor);
            list.append(characterDiv);
        
        });

        $("#castList").append(list);
        $(".addCast").append($("#castList"));
    });
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

function isEpisodeInWatchList(episode) {
    for (var i = 0; i < watchList.length; i++) {
        listItem = watchList[i];
        if (listItem.showName === episode.showName) {
            if (listItem.seasonNumber === episode.seasonNumber) {
                if (listItem.episodeNumber === episode.episodeNumber) {
                    return true;
                }
            }
        }
    }
    return false;
}

function addEpisodesToWatchList(episodes) {
    // watchList = watchList.concat(episodes);
    episodes.forEach(function(episode) {
        if (!isEpisodeInWatchList(episode)) {
            watchList.push(episode);
        }
    });
}

function seasonComparator(episode1, episode2) {
    if (episode1.seasonNumber == episode2.seasonNumber) {
        return 0;
    } else if (episode1.seasonNumber > episode2.seasonNumber) {
        return 1;
    } else {
        return -1;
    }
}

function showNameComparator(episode1, episode2) {
    if (episode1.showName == episode2.showName) {
        return seasonComparator(episode1, episode2);
    } else if (episode1.showName > episode2.showName) {
        return 1;
    } else {
        return -1;
    }
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
                    hidden: false,
                    watched: false,
                    showName: currentShow.name,
                    network: currentShow.network,
                    name: response.name,
                    episodeNumber: response.episode_number,
                    seasonNumber: response.season_number,
                    description: response.overview,
                    poster: currentShow.poster
                }
                var episodes = currentShow.seasons[response.season_number - 1].episodes;
                episodes[response.episode_number - 1] = myEpisode;
                console.log("Episode", episodes[response.episode_number - 1]);
                if (isAllEpisodesDownloaded(episodes)) {
                    addEpisodesToWatchList(episodes);
                    watchList.sort(showNameComparator);
                    saveWatchList(watchList);
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
        }
    });
    return myShow;
}

//add seasons on search page using forEach
//MATERIALIZE USED. Please follow class naming and setup for materialize
//will be moving div to the right to display character content on the left
function addSeasonWidgets(show) {
    var cardDiv = $("<div>")
        .addClass(".card");

    show.seasons.forEach(function (season) {
        var addToWatchListButton = $("<button>")
            .text("Add to WatchList")
            .addClass("btn waves-effect black addToWatchList")
            .attr("data-showName", show.name)
            .attr("data-seasonNumber", season.seasonNumber);
        var cardActionDiv = $("<div>")
            .addClass("card-action")
            .append(addToWatchListButton);
        var contentP = $("<p>")
            .text(season.description);
        var contentSpan = $("<span>")
            .addClass("card-title")
            .text(season.seasonName + " Episodes: " + season.episodeCount);
        var contentDiv = $("<div>")
            .addClass("card-content")
            .append(contentSpan, contentP);
        var rowDiv = $("<div>")
            .addClass("card")
            .append(contentDiv, cardActionDiv)
            cardDiv.append(rowDiv);
    });


    $(".showSeasons").append(cardDiv);
    $(".addSeason").append($(".addSeason"));
}

function setPoster(poster) {
    $("#poster").attr("src", poster);
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
                seasons: [],
                poster: movieDBPictureAPI + response.poster_path
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
        generateCastList(tmdbID);
        setPoster(show.poster);
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

function getOMDBIDandSeasons(show) {
    console.log("getOMDBIDandSeasons");
    console.log("Searching for", show);
    var myURL = searchOmdbURL + show;
    console.log(myURL);
    $.get(myURL).then(function (response) {
        console.log(response);
        console.log("IMDB ID:", response.imdbID);
        // I now have the IMDB ID, fire another ajax to get the TMDB ID
        getTMDBIDAndSeasons(response.imdbID);
    });
}

function searchShowBtnClicked(event) {
    event.preventDefault();
    $(".showSeasons").show();
    $(".showSeasons").empty();
    console.log("Get Seasons");
    var show = $("#searchedShow").val().trim();
    getOMDBIDandSeasons(show);

}

function cardActionButtonClicked(event) {
    console.log(this);
    var showName = $(this).attr("data-showName");
    var seasonNumber = $(this).attr("data-seasonNumber");
    getEpisodes(showName, seasonNumber);
}

function newUserDataCallback(snapshot) {
    var response = snapshot.val();
    console.log("Watchlist changed:", response);
    watchList = [];
    if (response !== null) {
        if (response.watchList !== undefined) {
            watchList = response.watchList;
        }
    }
}

$(function () {
    initializeFirebase();
    setUserName();
    $(".showSeasons").hide();
    $("#searchShowBtn").on("click", searchShowBtnClicked);
    $(document).on("click", ".addToWatchList", cardActionButtonClicked);
    userDataRef.on("value", newUserDataCallback);
});