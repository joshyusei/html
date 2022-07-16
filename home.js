function restart() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 ) {
            if ( this.status == 200) {
                alert("重新啟動中...")
            }
            else {
                alert("重新啟動失敗")
            }
        }
    }
    xhttp.open("GET", "control?restart", true);
    xhttp.send();
}
