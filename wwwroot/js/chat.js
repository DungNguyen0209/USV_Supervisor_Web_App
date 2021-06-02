"use strict";
var connection = new signalR.HubConnectionBuilder().withUrl("/updatedevicehub").build();

let map;
let myChart;
let marker;
let markers = [];
let Warning_flag;
let _location;
let cityCircle;
let myChart1;
let myChart2;

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
connection.start().then(function () {
}).catch(function (err) {
    return console.error(err.toString());
});

connection.on("ReceiveMessage", function (odomFrame, Setpoint, Sensor) {
    var odom = JSON.parse(odomFrame);
    var Sensor = JSON.parse(Sensor);
    var Setpoint = JSON.parse(Setpoint);
    //var Error = JSON.parse(Error);
    var currentdate = new Date();
    var timest = currentdate.toLocaleTimeString();
    var time = String(timest);
    var data = [odom.latitude, odom.longitude, odom.position_x, odom.position_y, odom.linear_velocity_x, odom.linear_velocity_y, odom.orientation_z, Setpoint.linear_velocity_x, Setpoint.orientation_z, Error.along_track, Error.cross_track];
    if (map != undefined) {
        UpdateMarker((odom.latitude / Math.pow(10, 7)), (odom.longitude / Math.pow(10, 7)), Sensor.distance_left, Sensor.distance_right , Sensor.temperature , (odom.orientation_z / Math.pow(10, 7)));
    }
    if ((myChart1 != undefined) && (myChart2 != undefined))
        { UpdateData(time, data); }
});





function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: new google.maps.LatLng(160, 20),
        panControl: true,
        zoomControl: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DEFAULT
        },
        scaleControl: true,
        streetViewControl: true,
        overviewMapControl: true,
        rotateControl: true,
    });

    marker = new google.maps.Marker({
        position: map.getCenter(),
        icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 5,
            strokeWeight: 2,
            strokeColor: "#B40404",
            center: _location,
        },

        animation: google.maps.Animation.DROP,
        draggable: true,
        map: map
    });

    cityCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.20,
        map,
        center: map.getCenter(),
        radius: 50000* 40,
    })

    map.addListener("click", (event) => {
        addMarker(event.latLng);
    });
    const centerControlDiv = document.createElement("div");
    CenterControl(centerControlDiv, map);
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
}

function UpdateLocation(lat, lng) {
    _location = { lat: +lat, lng: +lng };
}

function CenterControl(controlDiv, map) {
  // Set CSS for the control border.
  const controlUI = document.createElement("div");
  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginTop = "8px";
  controlUI.style.marginBottom = "22px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Click to recenter the map";
  controlDiv.appendChild(controlUI);
  // Set CSS for the control interior.
  const controlText = document.createElement("div");
  controlText.style.color = "rgb(25,25,25)";
  controlText.style.fontFamily = "Roboto,Arial,sans-serif";
  controlText.style.fontSize = "16px";
  controlText.style.lineHeight = "38px";
  controlText.style.paddingLeft = "5px";
  controlText.style.paddingRight = "5px";
  controlText.innerHTML = "Center Map";
  controlUI.appendChild(controlText);
  // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
        map.setCenter(_location);
  });
}


function UpdateMarker(lat, lng, distance_left, distance_right,temperature,rotate) {
    UpdateLocation(lat, lng);
    var newLatLng = new google.maps.LatLng(lat, lng);
    if (marker != undefined) {
        var icon = marker.getIcon();
        icon.rotation = (rotate / Math.PI) * 180 + 180;
        marker.setIcon(icon);
        marker.setPosition(newLatLng);
    }
    else {
        marker = new google.maps.Marker({
            position: newLatLng,
            map: map,
            draggable: true,
            rotation: (rotate * 180 / Math.PI) + 180
        });
    }
    Warning_flag = Warning(distance_left, distance_right, temperature);
    if (Warning_flag == true) {
        cityCircle.setCenter(newLatLng)
        var Circlepro = cityCircle.getIcon();
        Circlepro.visible = true;
        cityCircle.setIcon(Circlepro);
    }
    else {
        var Circlepro = cityCircle.getIcon();
        Circlepro.visible = false;
        cityCircle.setIcon(Circlepro);
    }
}



    
function addMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
}


// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

//Warning the USV from sonar sensor
function Warning(distance_left, distance_right, temperature) {
    if (distance_left <20 || distance_right <10 || temperature >40) { return true }
    else { return false }
}

function drawing() {
    var ctx_odom = document.getElementById("myChart_odom");
        myChart1 = new Chart(ctx_odom, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    data: [],
                    label: "Latitude",
                    borderColor: "#3e95cd",
                    fill: false,
                    tension: 0.1,
                    pointRadius:0
                },
                {
                    data: [],
                    label: "longitude",
                    borderColor: "#8e5ea2",
                    fill: false,
                    tension: 0.1,
                    pointRadius:0
                },
                {
                    data: [],
                    label: "position.x",
                    borderColor: "#3cba9f",
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0
                },
                {
                    data: [],
                    label: "position.y",
                    borderColor: "#e8c3b9",
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0
                },
                {
                    data: [],
                    label: "linear_velocity.x",
                    borderColor: "#c45850",
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0
                },
                {
                    data: [],
                    label: "linear_velocity.y",
                    borderColor: "#c45850",
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0
                },

            ]
            },
            options: {
                datasets: {
                    line: {
                        pointRadius: 0 // disable for all `'line'` datasets
                    }
                },
                elements: {
                    point: {
                        radius: 0 // default to disabled in all datasets
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            display: false
                        }
                    }]
                }
            }
    });
    var ctx_setpoint = document.getElementById("myChart_setpoint");
        myChart2 = new Chart(ctx_setpoint, {
        type: 'line',
        data: {
            labels: ['0'],
            datasets: [
                {
                    data: [0],
                    label: "linear_velocity_x",
                    borderColor: "#3e95cd",
                    fill: false,
                    pointRadius:0
                },
                {
                    data: [0],
                    label: "orirentation.z",
                    borderColor: "#c45850",
                    fill: false,
                    pointRadius:0
                },
                {
                    data: [0],
                    label: "along_track",
                    borderColor: "#3cba9f",
                    fill: false,
                    pointRadius:0
                },
                {
                    data: [0],
                    label: "cross_track",
                    borderColor: "#c45850",
                    fill: false,
                    pointRadius:0
                },               

            ]
            },
            options: {
                datasets: {
                    line: {
                        pointRadius: 0 // disable for all `'line'` datasets
                    }
                },
                elements: {
                    point: {
                        radius: 0 // default to disabled in all datasets
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            display: false
                        }
                    }]
                }
            }
        });
}
function UpdateData(_label, _data) {
    addData(myChart1, _label, _data);
    addData(myChart2, _label, _data);

}
function addData(chart, label, data) {
    chart.data.labels.push(label);
    if (chart == myChart1) {
        for (var i = 0; i <= 5; i++)
            chart.data.datasets[i].data.push(data[i]);
    }
    if (chart == myChart2) {
        for (var j = 0; j <= 3; j++)
            chart.data.datasets[j].data.push(data[j + 6]);
    }
     chart.update();
    if (chart.data.datasets[0].data.length >= 10) {
        removeData(chart)
    }
}

function removeData(chart) {
    chart.data.labels.splice(0, 1);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.splice(0, 1);
    });
    chart.update();
}


function updateScale(chart) {
    chart.options.scales.y = {
        type: 'logarithmic'
    };
    chart.update();
}



