
// Espisodate show search API endpoint
var showSearchURL = "https://www.episodate.com/api/search?q=" // yourshowhere&page=1"
var showSearchSuffix = "&page=1";
var showSearchDetailsURL = "https://www.episodate.com/api/show-details?q="
var searchOmdbURL = "https://www.omdbapi.com/?apikey=f8e29b5&t=";
var wikipediaURL = "https://en.wikipedia.org/wiki/";
var movieDBAPI = "https://api.themoviedb.org/3/";
var movieDBAPISuffix = "?api_key=29a27fe8b3f85bad1ab054a647529d57";
var movieDBAPISourceSuffix = "&external_source=imdb_id";

var shows = [];
var currentShow = {};

function addEpisodeWidgets(episodes) {
    console.log("addEpisodeWidgets");
    // TODO Create episode widgets here and dynamically add to html
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

//add seasons on search page using forEach
//each currently displayed in a new div, working on fixing card display
function addSeasonWidgets(show) {

    var searchResults="";
  show.seasons.forEach(function(season){  
    searchResults += "<div>" + season.seasonName 
    + " Episodes: " 
    + season.episodeCount + "</div><div>"
    + " Description: " 
    + season.description + "</div><br>"
    });
    $(".card").append(searchResults);
    $(".showSeasons").append($(".card"));
  
 
    
    // TODO Create season widgets here and dynamically add to html
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

function searchShowBtnClicked(event){
    event.preventDefault();
    $(".showSeasons").show();
    console.log("Get Seasons");
    var show = $("#searchedShow").val().trim();
    getOMDBIDandSeasons(show);

}

$(function(){
    $(".showSeasons").hide();
    $("#searchShowBtn").on("click", searchShowBtnClicked);
    

});