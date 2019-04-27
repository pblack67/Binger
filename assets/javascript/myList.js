function createWatchList(watchList) {
    watchList.forEach(function (episode) {
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
            .append(cardSpan);
        var cardDiv = $("<div>")
            .addClass("card")
            .append(cardContentDiv, cardRevealDiv);
        $("#episodeList").append(cardDiv);
    });
}

function newUserDataCallback(snapshot) {
    var response = snapshot.val();
    console.log("Watchlist changed:", response);
    if (response !== null) {
        if (response.watchList !== undefined) {
            $("#episodeList").empty();
            createWatchList(response.watchList);
            // watchList = response.watchList;
        }
    }
}

$(function () {
    userDataRef.on("value", newUserDataCallback);
})