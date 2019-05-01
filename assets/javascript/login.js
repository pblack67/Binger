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
        window.location.href = "discover.html";
    } else {
        $("#errorMessage").show();
    }
}

$(function () {
    $("#loginButton").on("click", loginButtonClicked);
    initializeNames();
    $("#logout").on("click", logoutButtonClicked);
    setUserName();
    $(".dropdown-trigger").dropdown();
})