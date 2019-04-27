var watchList = [];

function createWatchList(watchList) {
    watchList.forEach(function (episode) {
        if (!episode.watched) {
            var setWatchedButton = $("<button>")
                .text("Watched")
                .addClass("btn waves-effect black setWatchedButton")
                .attr("data-showName", episode.showName)
                .attr("data-seasonNumber", episode.seasonNumber)
                .attr("data-episodeNumber", episode.episodeNumber);
            var descriptionP = $("<p>")
                .text(episode.description);
            var closeIcon = $("<i>")
                .addClass("material-icons right")
                .text("close");
            var cardSpan = $("<span>")
                .addClass("card-title")
                .append(closeIcon);
            var cardRevealDiv = $("<div>")
                .addClass("card-reveal")
                .append(cardSpan, descriptionP);
            var moreIcon = $("<i>")
                .addClass("material-icons right")
                .text("more_vert");
            var cardSpan = $("<span>")
                .addClass("card-title")
                .text(episode.showName + " (" + episode.network + ") Season "
                    + episode.seasonNumber + " " + " Episode " + episode.episodeNumber)
                .append(moreIcon);
            var cardContentDiv = $("<div>")
                .addClass("card-content activator grey-text text-darken-4")
                .append(cardSpan, setWatchedButton);
            var cardDiv = $("<div>")
                .addClass("card")
                .append(cardContentDiv, cardRevealDiv);
            $("#episodeList").append(cardDiv);
        }
    });
}

function newUserDataCallback(snapshot) {
    var response = snapshot.val();
    console.log("Watchlist changed:", response);
    $("#episodeList").empty();
    if (response !== null) {
        if (response.watchList !== undefined) {
            $("#episodeList").empty();
            createWatchList(response.watchList);
            watchList = response.watchList;
        }
    }
}

function findEpisode(showName, seasonNumber, episodeNumber) {
    for (var i = 0; i < watchList.length; i++){
        var myEpisode = watchList[i];
        if (myEpisode.showName === showName) {
            if (myEpisode.seasonNumber == seasonNumber) {
                if (myEpisode.episodeNumber == episodeNumber) {
                    return myEpisode;
                }
            }
        }
    }

    return null;
}

function setWatchedButtonClicked(event) {
    console.log("setWatchedButtonClicked");
    console.log(this);
    var showName = $(this).attr("data-showName");
    var seasonNumber = $(this).attr("data-seasonNumber");
    var episodeNumber = $(this).attr("data-episodeNumber");
    var episode = findEpisode(showName, seasonNumber, episodeNumber);
    if (episode !== null) {
        console.log("Episode found");
        episode.watched = true;
        saveWatchList(watchList);
    }
}

$(function () {
    $(document).on("click", ".setWatchedButton", setWatchedButtonClicked);

    userDataRef.on("value", newUserDataCallback);
})