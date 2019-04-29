// Initialize Firebase
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
    console.log("loginEmail", userName);
    userDataRef = database.ref("/" + userName);
}

function setUserName() {
    var userName = localStorage.getItem("userName");
    if ((userName !== null) && (userName !== undefined)) {
        $("#userName").text(userName);
    }
}
