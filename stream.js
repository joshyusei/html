var baseHost = 'http://' + location.host
// var baseHost = 'http://192.168.0.133'
var menu_switch = document.getElementById('sideMenu--active')
function pageclick() {
    menu_switch.click();
}
const stream_img = document.getElementById('stream-img');
const stream = document.getElementById('stream');
stream.onclick = () => {
    if (stream.checked == true) {
        stream_img.src = baseHost + ':81/stream'
    } else {
        stream_img.src = ''
    }
}
const menu_change = document.getElementById('menu-change');
const stream_setting = document.getElementById('stream-setting');
const car_setting = document.getElementById('car-setting');
const title = document.getElementById('title');
menu_change.onclick = () => {
    if (stream_setting.style.display == 'none') {
        car_setting.style.display = 'none'
        stream_setting.style.display = 'block'
        title.textContent = '影像設定'
    }
    else {
        stream_setting.style.display = 'none'
        car_setting.style.display = 'block'
        title.textContent = '遙控車設定'
    }
}

const updateValue = (el, value, updateRemote) => {
    updateRemote = updateRemote == null ? true : updateRemote
    let initialValue
    if (el.type === 'checkbox') {
        initialValue = el.checked
        value = !!value
        el.checked = value
    } else {
        initialValue = el.value
        el.value = value
    }
    el.title = value;

    if (updateRemote && initialValue !== value) {
        updateConfig(el);
    }
}

function updateConfig(el) {
    let value
    switch (el.type) {
        case 'checkbox':
            value = el.checked ? 1 : 0
            break
        case 'range':
        case 'select-one':
            value = el.value
            break
        case 'button':
        case 'submit':
            value = '1'
            break
        default:
            return
    }

    const query = `${baseHost}/control?var=${el.id}&val=${value}`
    el.title = value;

    fetch(query)
        .then(response => {
            console.log(`request to ${query} finished, status: ${response.status}`)
        })
}

document
    .querySelectorAll('.close')
    .forEach(el => {
        el.onclick = () => {
            hide(el.parentNode)
        }
    })

// read initial values
fetch(`${baseHost}/status`)
    .then(function (response) {
        return response.json()
    })
    .then(function (state) {
        document
            .querySelectorAll('.default-action')
            .forEach(el => {
                updateValue(el, state[el.id], false)
            })
        // result.innerHTML = "Connection successful";
    })

// Attach default on change action
document
    .querySelectorAll('.default-action')
    .forEach(el => {
        el.onchange = () => updateConfig(el)
    })

// 自訂類別my-action, title屬性顯示數值
document
    .querySelectorAll('.my-action')
    .forEach(el => {
        el.title = el.value;
        el.onchange = () => el.title = el.value;
    })

// Custom actions

// const framesize = document.getElementById('framesize')

// framesize.onchange = () => {
//     updateConfig(framesize)
// }


var joy1IinputPosX = document.getElementById("joy1PosizioneX");
var joy1InputPosY = document.getElementById("joy1PosizioneY");
var joy1Direzione = document.getElementById("joy1Direzione");
var joy1X = document.getElementById("joy1X");
var joy1Y = document.getElementById("joy1Y");
/*
setInterval(function(){ joy1IinputPosX.value=Joy1.GetPosX(); }, 50);
setInterval(function(){ joy1InputPosY.value=Joy1.GetPosY(); }, 50);
setInterval(function(){ joy1Direzione.value=Joy1.GetDir(); }, 50);
setInterval(function(){ joy1X.value=Joy1.GetX(); }, 50);
setInterval(function(){ joy1Y.value=Joy1.GetY(); }, 50);
*/
// Create JoyStick object into the DIV 'joy1Div'
var Joy1 = new JoyStick('joy1Div', {}, function (stickData) {
    // joy1IinputPosX.value = stickData.xPosition;
    // joy1InputPosY.value = stickData.yPosition;
    // joy1Direzione.value = stickData.cardinalDirection;
    // joy1X.value = stickData.x;
    // joy1Y.value = stickData.y;
}, function () {
    const query = `${baseHost}/car?var=s`
    fetch(query)
        .then(response => {
            console.log(`request to ${query} finished, status: ${response.status}`)
        })
});

setInterval(function () {
    if (Joy1.GetPressed()) {
        let cmd = ''
        let left_rate = 1, right_rate = 1
        switch (Joy1.GetDir()[0]) {
            case "f":
                cmd = 'f'
                break
            case "b":
                cmd = 'b'
                break
            // case "l":
            //     cmd = 'l'
            //     break
            // case "r":
            //     cmd = 'r'
            //     break
            default:
                break
        }
        if (Joy1.GetDir()[1] == 'r') {
            right_rate *= (parseInt(Joy1.GetDir()[Joy1.GetDir().length - 1]) - 1) / 5
        }
        else {
            left_rate *= (parseInt(Joy1.GetDir()[Joy1.GetDir().length - 1]) - 1) / 5
        }
        right_rate *= (Math.floor(Joy1.GetX() / 20) + 5) / 10
        left_rate *= (Math.floor(Joy1.GetX() / 20) + 5) / 10
        const query = `${baseHost}/car?var=${cmd}&right=${right_rate.toFixed(2)}&left=${left_rate.toFixed(2)}`
        fetch(query)
            .then(response => {
                console.log(`request to ${query} finished, status: ${response.status}`)
            })
    }
}, 200)