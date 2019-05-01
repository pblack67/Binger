$(function () {
    $("#logout").on("click", logoutButtonClicked);
    setUserName();
    checkLoginStatus();
    $(".dropdown-trigger").dropdown();
});
