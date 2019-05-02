function loginButtonClicked(event) {
    event.preventDefault();
    var email = $("#email").val().trim();
    var firstName = $("#first_name").val().trim();
    var lastName = $("#last_name").val().trim();

    if ((email !== "") && (firstName !== "") && (lastName !== "")) {
        email = email.replace(/\./g, "_");
        var userName = firstName + " " + lastName;
        localStorage.setItem("userName", userName);
        localStorage.setItem("loginEmail", email);
        initializeNames();
        $("#errorMessage").hide();

        $("#email").val("");
        $("#first_name").val("");
        $("#last_name").val("");
        window.location.href = "discover.html";
    } else {
        $("#errorMessage").show();
    }
}

function initializeNames() {
    var email = localStorage.getItem("loginEmail");
    if ((email == null) || (email == undefined)) {
        $("#loginForm").show();
        $("#welcomeBack").hide();
        $("#navMenu").hide();
    } else {
        $("#loginForm").hide();
        $("#welcomeBack").show();
        $("#navMenu").show();
        var userName = localStorage.getItem("userName");
        $("#welcomeUserName").text(userName + "!");
    }
}

$(function () {
    initializePage(false);
    initializeNames();
    $("#loginButton").on("click", loginButtonClicked);
    $("#first_name").focus();
})