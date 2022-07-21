var basehost='http://'+location.host
var wifiinfo = {}
var scanwifi = []
info()
scan()

function info() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var te = this.responseText
            var temps = ''
            for (i = 0; i < te.length; i++) {
                if (te[i] != '\n') {
                    temps += te[i]
                }
                else {
                    if (Object.keys(wifiinfo).length == 0) {
                        wifiinfo['ssid'] = temps
                    }
                    else if (Object.keys(wifiinfo).length == 1) {
                        wifiinfo['rssi'] = temps
                    }
                    else if (Object.keys(wifiinfo).length == 2) {
                        wifiinfo['ip'] = temps
                    }
                    temps = ''
                }
            }
            if(wifiinfo['ssid']==''){
                document.querySelector('#info_content').innerHTML = `<span>尚未連到wifi</span>`
            }
            document.querySelector('#info_content').innerHTML = `
                <span>ssid: ${wifiinfo['ssid']}</span>
                <span>rssi: ${wifiinfo['rssi']}</span>
                <span>local ip: ${wifiinfo['ip']}</span>
                `
        }
    }
    xhttp.open("GET", basehost+'/wifiinfo', true);
    xhttp.send();
}
function scan() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var te = this.responseText
            scanwifi = []
            let tempd = {}
            var temps = ''
            for (i = 0; i < te.length; i++) {
                if (te[i] != '\n') {
                    temps += te[i]
                }
                else {
                    if (Object.keys(tempd).length == 0) {
                        tempd['ssid'] = temps
                    }
                    else if (Object.keys(tempd).length == 1) {
                        tempd['rssi'] = temps
                        scanwifi.push(tempd)
                        tempd = {}
                        var node0 = document.createElement('tr');
                        var node1 = document.createElement('td');
                        var node2 = document.createElement('td');
                        node1.setAttribute("valign", "center")
                        node1.innerHTML = `<button class="ssid" onclick="hide(hide${scanwifi.length},hide${scanwifi.length}.style.display)">${scanwifi[scanwifi.length - 1]['ssid']}</button>  
                        <div class='hide' id="hide${scanwifi.length}" style="display: none;">
                            <input id="textbox${scanwifi.length}" type="password" placeholder="請輸入密碼"/>
                            <input type="button" onclick="link(${scanwifi.length})" value="連線" />
                        </div>`
                        node2.textContent = scanwifi[scanwifi.length - 1]['rssi'];
                        node0.appendChild(node1);
                        node0.appendChild(node2);
                        document.querySelector('table').appendChild(node0);
                    }
                    temps = ''
                }
            }
            document.getElementById('init_font').innerHTML = '<b>搜索完成</b>'
        }
    };
    xhttp.open("GET", basehost+'/scanwifi', true);
    xhttp.send();
}

function hide(id, display) {
    if (display == 'none') {
        hide_ele = document.querySelectorAll('.hide')
        for (i = 0; i < hide_ele.length; i++) {
            hide_ele[i].style.display = 'none'
        }
        id.style.display = 'block'
    }
    else {
        id.style.display = 'none'
    }
}

function link(id) {
    password = document.getElementById(`textbox${id}`).value
    var data = new FormData();
    data.append('ssid', scanwifi[id - 1]['ssid']);
    data.append('password', password);
    param = `ssid=${scanwifi[id - 1]['ssid']}&password=${password}`
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", basehost+'/resetwifi', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText)
        }
    };
    xhttp.send(param);
}
