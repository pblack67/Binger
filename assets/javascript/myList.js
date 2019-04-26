// {/* <div class="card">
// <div class="card-content activator grey-text text-darken-4">
//     <span class="card-title">Doctor Who Series 11 Episode 4<i
//             class="material-icons right">more_vert</i></span>
//     <p><a href="#">A link to Wiki or some other place</a></p>
// </div>
// <div class="card-reveal">
//     <span class="card-title grey-text text-darken-4"><i
//             class="material-icons right">close</i></span>
//     <p>The Doctor, Yaz, Graham, and Ryan find their way back to Yorkshire only to find something is
//         stirring amidst the eight-legged arachnid population of Sheffield.</p>
// </div>
// </div> */}

function createWatchList(watchList) {
    watchList.forEach(function (episode) {
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
            .append(cardContentDiv);
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