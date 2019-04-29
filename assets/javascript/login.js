function loginButtonClicked(event) {
    event.preventDefault();
    var email = $("#email").val().trim();
    var firstName = $("#first_name").val().trim();
    var lastName = $("#last_name").val().trim();

    if ((email !== "") && (firstName !== "") && (lastName !== "")) {
        email = email.replace(".", "_");
        var userName = firstName + " " + lastName;
        localStorage.setItem("userName", userName);
        localStorage.setItem("loginEmail", email);
        initializeNames();
        $("#errorMessage").hide();

        $("#email").val("");
        $("#first_name").val("");
        $("#last_name").val("");
    } else {
        $("#errorMessage").show();
    }
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
    localStorage.removeItem("loginEmail");
    localStorage.removeItem("userName");
    initializeNames();
}

$(function () {
    $("#loginButton").on("click", loginButtonClicked);
    $("#logoutButton").on("click", logoutButtonClicked);
    initializeNames();
})