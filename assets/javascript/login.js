function loginButtonClicked(event) {
    console.log("loginButtonClicked");
    event.preventDefault();
    var email = $("#email").val();
    email = email.replace(".", "_");
    var userName = $("#first_name").val() + " " + $("#last_name").val();
    localStorage.setItem("userName", userName);
    localStorage.setItem("loginEmail", email);
    initializeNames();
}

function initializeNames() {
    setUserName();

    var email = localStorage.getItem("loginEmail");
    if ((email == null) || (email == undefined)) {
        $("#loginForm").show();
        $("#welcomeBack").hide();
    } else {
        $("#loginForm").hide();
        $("#welcomeBack").show();
        var userName = localStorage.getItem("userName");
        $("#welcomeUserName").text(userName + "!");
    }
}

function logoutButtonClicked() {
    console.log("logoutButtonClicked");
    localStorage.removeItem("loginEmail");
    localStorage.removeItem("userName");
    initializeNames();
}

$(function () {
    $("#loginButton").on("click", loginButtonClicked);
    $("#logoutButton").on("click", logoutButtonClicked);
    initializeNames();
})