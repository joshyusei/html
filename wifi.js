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
                            tempd['rssi'] = temps
                        }
                        else if (Object.keys(wifiinfo).length == 1) {
                            tempd['ip'] = temps
                        }
                        var node0 = document.createElement('tr');
                        var node1 = document.createElement('td');
                        var node2 = document.createElement('td');
                        node1.setAttribute("valign", "center")
                        node1.innerHTML = `<button class="noborder" onclick="hide(hide${scanwifi.length},hide${scanwifi.length}.style.display)">${scanwifi[scanwifi.length - 1]['ssid']}</button>  
                        <div class='hide' id="hide${scanwifi.length}" style="display:none">
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
        }
        xhttp.open("GET", "http://192.168.0.133/control?wifiinfo", true);
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
                document.getElementById('init_font').textContent = '搜索完成'
            }
        };
        xhttp.open("GET", "http://192.168.0.133/control?scanwifi", true);
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
        xhttp.open("POST", `http://192.168.0.133:82/resetwifi`, true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText)
            }
        };
        xhttp.send(param);
    }