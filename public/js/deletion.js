function deleteIt() {
    var confirmation = confirm("Are you sure you want do delete this tournament?");
    if (confirmation == true) {
        window.location = "/";
    } else {
        return false;
    }
}