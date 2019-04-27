// Initialize Firebase
var config = {
    apiKey: "AIzaSyASf5abJN7fdfHPBPUR9IC8VH9q4ViqLQE",
    authDomain: "binger-95cf5.firebaseapp.com",
    databaseURL: "https://binger-95cf5.firebaseio.com",
    projectId: "binger-95cf5",
    storageBucket: "binger-95cf5.appspot.com",
    messagingSenderId: "956862325677"
};
firebase.initializeApp(config);

var database = firebase.database();

var userDataRef = database.ref("/userData");

function saveWatchList(watchList) {
    console.log("Saving WatchList:", watchList);
    var result = userDataRef.set(
        {
            watchList
        }
    );
    console.log(result);
}

