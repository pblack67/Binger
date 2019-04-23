// Espisodate show search API endpoint
var showSearchURL = "https://www.episodate.com/api/search?q=" // yourshowhere&page=1"
var showSearchSuffix = "&page=1";
var showSearchDetailsURL = "https://www.episodate.com/api/show-details?q="

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
        resultOBJ.tv_shows.forEach(function(tvShow) {
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
    $.get(myURL).then(function (response) {
        console.log(response);
        var resultOBJ = JSON.parse(response);
        var resultText = JSON.stringify(resultOBJ, null, 2);

        // var showText = "";
        // resultOBJ.tv_shows.forEach(function(tvShow) {
        //     showText += tvShow.name;
        //     showText += " (";
        //     showText += tvShow.network;
        //     showText += ")\n"
        // });

        // resultText = showText + resultText;

        console.log(resultText);
        $("#searchShowDetailsResults").text(resultText);

    });
}

$(function() {
    $("#searchShowButton").on("click", searchShowButtonClicked);
    $("#searchShowDetailsButton").on("click", searchShowDetailsButtonClicked);

});