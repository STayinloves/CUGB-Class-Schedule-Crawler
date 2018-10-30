var currentWeek = 1;
var previousWeek = 1;
var course = {};
const MAX_WEEK = 18
const DAY_OF_WEEK = 7
const CLASS_OF_DAY = 11
function setSideNav() {
    let nav = document.getElementById("side-nav");
    for (let i = 1; i <= MAX_WEEK; i++) {
        let newA = document.createElement("a");
        newA.setAttribute("class", "mdl-navigation__link");
        newA.setAttribute("onclick", `setTable(${i})`);
        newA.setAttribute("id", `week-${i}`);
        newA.innerText = `第${i}周`;
        nav.appendChild(newA);
    }
}

function clearAllData() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(function (reg) {

            // set up a message channel to communicate with the SW
            var channel = new MessageChannel();
            channel.port1.onmessage = function (e) {
                navigator.serviceWorker
                    .getRegistrations()
                    .then(function (registrations) {
                        for (let registration of registrations) {
                            registration.unregister()
                        }
                        console.log('done')
                        alert("请登录后尝试");
                        window.location.assign("/");
                    })
            }
            mySW = reg.active;
            mySW.postMessage('clear', [channel.port2]);
        })
    } else {
        alert("请登录后尝试");
        window.location.assign("/");
    }
}

setSideNav();

axios.get("api/getWeek")
    .then(function (res) {
        currentWeek = parseInt(res.data.substr(1, res.data.length - 2));
        document.getElementById(`week-${currentWeek}`).innerText += "(c)";
        console.log(currentWeek);
    })
    .catch(function (err) {
        clearAllData();
    });

axios.get("api/getCourse")
    .then(function (res) {
        setTimeout(function () {
            setCourse(res.data);
        }, 2000);
    }).catch(function (err) {
        clearAllData();
    });

var sideNavHighlight = () => {
    document
        .getElementById(`week-${currentWeek}`)
        .setAttribute(
            "style",
            "color:white;background-color:#20295b;cursor:not-allowed"
        );
    document.getElementById(`week-${currentWeek}`).removeAttribute("onclick");
    document.getElementById(`week-${previousWeek}`).removeAttribute("style");
    document
        .getElementById(`week-${previousWeek}`)
        .setAttribute("onclick", `setTable(${previousWeek})`);
    previousWeek = currentWeek;
};

var setCourse = data => {
    for (let i = 0; i <= MAX_WEEK; i++) {
        course[i] = {};
        for (let j = 0; j <= DAY_OF_WEEK; j++) {
            course[i][j] = {};
            for (let k = 0; k <= CLASS_OF_DAY; k++) {
                course[i][j][k] = new Array();
            }
        }
    }
    let colorMap = new Map();
    for (let i in data) {
        for (let j of data[i]["time"]) {
            for (let k of j["week"]) {
                let l = (j["class"][0] + 1) / 2;
                try {
                    let color;
                    if (colorMap.has(data[i]["name"]))
                        color = colorMap.get(data[i]["name"]);
                    else {
                        color = randomColor();
                        colorMap.set(data[i]["name"], color);
                    }
                    course[k][j["date"]][l].push({
                        name: data[i]["name"],
                        room: j["room"],
                        teacher: data[i]["teachers"][0],
                        color: color
                    });
                } catch (err) {
                    console.log(err);
                    console.log(data[i])
                    console.log(k, l)
                }
            }
        }
    }
    setTableI();
};
function setTable(week) {
    currentWeek = week;
    document.getElementById("spinner").removeAttribute("hidden");
    var table = document.getElementById("main");
    table.innerHTML = "";
    setTimeout(function () {
        setTableI();
    }, 500);
};
function setTableI() {
    sideNavHighlight();
    var table = document.getElementById("main");
    table.innerHTML = "";
    for (let cla = 1; cla <= 5; cla++) {
        let newTR = document.createElement("tr");
        for (let day = 1; day <= DAY_OF_WEEK; day++) {
            let newTD = document.createElement("td");
            let newDiv = document.createElement("div");
            let text = "";
            let height = 100 / course[currentWeek][day][cla].length;
            for (let i = 0; i < course[currentWeek][day][cla].length; i++) {
                text +=
                    `<div class='cl' style='background-color:${course[
                    currentWeek
                    ][day][cla][i]["color"]["color"]};color:${course[
                    currentWeek
                    ][day][cla][i]["color"]["_color"]};height:${height}%;'>` +
                    course[currentWeek][day][cla][i]["name"] +
                    "<br>" +
                    course[currentWeek][day][cla][i]["teacher"] +
                    "<br><br>" +
                    course[currentWeek][day][cla][i]["room"] +
                    "</div>";
            }
            if (course[currentWeek][day][cla].length) {
                newDiv.innerHTML = text;
                newDiv.className = "hasclass mdl-shadow--2dp";
            }
            newTD.appendChild(newDiv);
            newTR.appendChild(newTD);
        }
        if (cla === 5 && newTR.innerText === "") continue;
        table.appendChild(newTR);
    }
    document.getElementById("spinner").setAttribute("hidden", "");
};

function logout() {
    document.cookie = "JSESSIONID=f; expires=Thu, 18 Dec 2013 12:00:00 UTC";
    clearAllData()
};
var _mdcolor = [0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0];
var mdcolor = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFEB3B",
    "#FFC107",
    "#FF9800",
    "#FF5722",
    "#795548",
    "#9E9E9E",
    "#607D8B"
];
var seed = Math.ceil(Math.random() * mdcolor.length);
var randomColor = () => {
    return {
        _color: _mdcolor[seed % _mdcolor.length]
            ? "rgba(0, 0, 0, 0.87)"
            : "#fff",
        color: mdcolor[seed++ % mdcolor.length]
    };
};
