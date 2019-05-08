var watchList = [];
var filteredWatchList = [];

function createEpisodeCard(episode, element) {
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
    element.append(cardDiv);
}

function createSeasonList(watchList) {
    var seasons = [];
    $("#seasonCollapse").empty();
    var currentBody = null;
    watchList.forEach(function (episode) {
        if (!episode.watched) {
            if (seasons.indexOf(episode.seasonNumber) == -1) {
                seasons.push(episode.seasonNumber);
                var seasonTextSpan = $("<span>")
                    .text("Season " + episode.seasonNumber);
                var seasonWatchedButton = $("<button>")
                    .text("Watched")
                    .addClass("btn waves-effect black seasonWatchedButton")
                    .attr("data-showName", episode.showName)
                    .attr("data-seasonNumber", episode.seasonNumber);
                var header = $("<div>")
                    .addClass("collapsible-header valign-wrapper")
                    .append(seasonTextSpan)
                    .append(seasonWatchedButton);
                currentBody = $("<div>")
                    .addClass("collapsible-body");
                var listItem = $("<li>")
                    .append(header)
                    .append(currentBody)
                    .attr("id", "season" + episode.seasonNumber);
                $("#seasonCollapse").append(listItem);
            }

            if (currentBody !== null) {
                createEpisodeCard(episode, currentBody);
            }
        }
    });
}

function initializeShowSelector() {
    var showList = [];
    $("#showSelector").empty();
    watchList.forEach(function (episode) {
        if (showList.indexOf(episode.showName) == -1) {
            showList.push(episode.showName);
            var option = $("<option>")
                .attr("value", episode.showName)
                .text(episode.showName);
            $("#showSelector").append(option);
        }
    });
}

function newUserDataCallback(snapshot) {
    var response = snapshot.val();
    $("#episodeList").empty();
    if (response !== null) {
        if (response.watchList !== undefined) {
            var showSelectorValue = $("#showSelector").val();
            var openSelectorID = $(".active").attr("id");

            $("#episodeList").empty();
            watchList = response.watchList;
            initializeShowSelector();
            filteredWatchList = filterWatchList(watchList, $("#showSelector").val());
            createSeasonList(filteredWatchList);
            if (filteredWatchList.length > 0) {
                $("#episodeImage").attr("src", filteredWatchList[0].poster);
            }
            if (showSelectorValue !== null) {
                $("#showSelector").val(showSelectorValue).change();
            }
            if (openSelectorID !== null) {
                $("#" + openSelectorID).addClass("active");
                $('.collapsible').collapsible();
            }
            $('select').formSelect();
        }
    }
}

function findEpisode(showName, seasonNumber, episodeNumber) {
    for (var i = 0; i < watchList.length; i++) {
        var myEpisode = watchList[i];
        if (myEpisode.showName === showName) {
            if (myEpisode.seasonNumber == seasonNumber) {
                if (myEpisode.episodeNumber == episodeNumber) {
                    return i;
                }
            }
        }
    }

    return null;
}

function deleteSeason(showName, seasonNumber) {
    console.log("deleteSeason", showName, seasonNumber);
    watchList = watchList.filter(function (episode) {
        return (episode.showName != showName)
            || (episode.seasonNumber != seasonNumber);
    });
    saveWatchList(watchList);
}

function setWatchedButtonClicked(event) {
    event.preventDefault();
    var showName = $(this).attr("data-showName");
    var seasonNumber = $(this).attr("data-seasonNumber");
    var episodeNumber = $(this).attr("data-episodeNumber");
    var index = findEpisode(showName, seasonNumber, episodeNumber);
    if (index !== null) {
        watchList.splice(index, 1);
        saveWatchList(watchList);
    }
}

function filterWatchList(watchList, showName) {
    var filtered = [];
    watchList.forEach(function (episode) {
        if (episode.showName == showName) {
            filtered.push(episode);
        }
    });
    return filtered;
}

function showSelectorChanged(event) {
    var showName = event.target.value;
    filteredWatchList = filterWatchList(watchList, showName);
    $("#episodeList").empty();
    createSeasonList(filteredWatchList);
    if (filteredWatchList.length > 0) {
        $("#episodeImage").attr("src", filteredWatchList[0].poster);
    }
}

function seasonWatchedButtonClicked(event) {
    console.log("seasonWatchedButtonClicked", this);
    var showName = $(this).attr("data-showName");
    var seasonNumber = $(this).attr("data-seasonNumber");
    deleteSeason(showName, seasonNumber);
}

$(function () {
    initializePage(true);
    $(document).on("click", ".setWatchedButton", setWatchedButtonClicked);
    $(document).on("change", "#showSelector", showSelectorChanged);
    $(document).on("click", ".seasonWatchedButton", seasonWatchedButtonClicked);
    userDataRef.on("value", newUserDataCallback);
    $('.collapsible').collapsible();
})