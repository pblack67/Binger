var config = {
    apiKey: "AIzaSyASf5abJN7fdfHPBPUR9IC8VH9q4ViqLQE",
    authDomain: "binger-95cf5.firebaseapp.com",
    databaseURL: "https://binger-95cf5.firebaseio.com",
    projectId: "binger-95cf5",
    storageBucket: "binger-95cf5.appspot.com",
    messagingSenderId: "956862325677"
};

var database = null;
var userName = null;
var userDataRef = null;

function saveWatchList(watchList) {
    console.log("Saving WatchList:", watchList);
    if (userName !== null) {
        var result = userDataRef.set(
            {
                watchList
            }
        );
        console.log(result);
    }
}

function initializeFirebase() {
    firebase.initializeApp(config);
    database = firebase.database();
    userName = localStorage.getItem("loginEmail");
    userDataRef = database.ref("/" + userName);
}

function setUserName() {
    userName = localStorage.getItem("userName");
    if ((userName !== null) && (userName !== undefined)) {
        $("#userName").text(userName);
        $("#logoutAnchor").show();
    } else {
        $("#userName").text("");
        $("#logoutAnchor").hide();
    }
}

function logoutButtonClicked() {
    console.log("logoutButtonClicked");
    localStorage.removeItem("loginEmail");
    localStorage.removeItem("userName");
    userName = null;
    window.location.href = "index.html";
}

function checkLoginStatus() {
    if (userName == null) {
        window.location.href = "index.html";
    }
}

function initializePage(checkLogin) {
    initializeFirebase();
    setUserName();
    if (checkLogin) {
        checkLoginStatus();
    }
    $(".dropdown-trigger").dropdown();
    $("#logout").on("click", logoutButtonClicked);
    $('.sidenav').sidenav({ closeOnClick: true });
}
