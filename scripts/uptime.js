var options = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false
};

var latencyTests = {};
var chartKeys = {
    "routerConnection": 1,
    "lobbyConnection": 2
}

$(document).ready(function () {
    setupRouterMonitor();
    setupLobbyMonitor();
    setupLogging();
    startCharts();
});

function setupRouterMonitor() {
    var routerTimeoutMilliSec = 35 * 1000;
    // var url = "https://pt8router.installprogram.eu/pokerBabelFish";
    var url = "https://mppgs1mobile.valueactive.eu/pokerBabelFish";
    var routerConnection = $.connection(url);
    routerConnection.logging = true;
    routerConnection.start();
    $("#routerUpdateTime").text("Starting...");
    $("#routerUrl").text(url);
    var routerTimer = setTimeout(function () { $("#router").removeClass("up"); }, routerTimeoutMilliSec);
    routerConnection.received(function (data) {
        clearTimeout(routerTimer);
        var timestamp = new Date().toLocaleString('en-ZA', options);
        $("#routerUpdateTime").text(timestamp);
        $("#router").addClass("up");
        console.log("Router Message: " + data);
        routerTimer = setTimeout(function () { $("#router").removeClass("up"); }, routerTimeoutMilliSec);
        // testLatency(routerConnection, "routerConnection");
    });

    routerConnection.disconnected(function () {
        setTimeout(function () {
            routerConnection.start();
        }, 5000); // Restart connection after 5 seconds.
    });

    routerConnection.error(function (error) {
        $("#router").removeClass("up");
        $("#routerUpdateTime").text("ERROR");
        console.log('Router SignalR Error: ' + error)
    });

    routerConnection.stateChanged(function (change) {
        if (change.newState === $.signalR.connectionState.connected) {
            testLatency(routerConnection, "routerConnection");
        }
    });
}

function setupLobbyMonitor() {
    var lobbyTimeoutMilliSec = 35 * 1000;
    // var url = "https://pt8lobby.installprogram.eu/pokerBabelFish"
    var url = "https://mpplobby3mobile.valueactive.eu/pokerBabelFish";
    var lobbyConnection = $.connection(url);
    lobbyConnection.logging = true;
    lobbyConnection.start();
    $("#lobbyUpdateTime").text("Starting...");
    $("#lobbyUrl").text(url);
    var lobbyTimer = setTimeout(function () { $("#lobby").removeClass("up"); }, lobbyTimeoutMilliSec);

    lobbyConnection.received(function (data) {
        clearTimeout(lobbyTimer);
        var timestamp = new Date().toLocaleString('en-ZA', options);
        $("#lobbyUpdateTime").text(timestamp);
        $("#lobby").addClass("up");
        console.log("Lobby Message: " + data);
        lobbyTimer = setTimeout(function () { $("#lobby").removeClass("up"); }, lobbyTimeoutMilliSec);
        // testLatency(lobbyConnection, "lobbyConnection");
    });

    lobbyConnection.disconnected(function () {
        setTimeout(function () {
            lobbyConnection.start();
        }, 5000); // Restart connection after 5 seconds.
    });

    lobbyConnection.error(function (error) {
        $("#lobby").removeClass("up");
        $("#lobbyUpdateTime").text("ERROR");
        console.log('Lobby SignalR Error: ' + error)
    });

    lobbyConnection.stateChanged(function (change) {
        if (change.newState === $.signalR.connectionState.connected) {
            testLatency(lobbyConnection, "lobbyConnection");
        }
    });
}

function setupLogging() {
    setInterval(function () {
        $("#log").animate({ scrollTop: $('#log').prop("scrollHeight") }, 1000);
    }, 60000);

    if (typeof console != "undefined")
        if (typeof console.log != 'undefined')
            console.olog = console.log;
        else
            console.olog = function () { };

    console.log = function (message) {
        console.olog(message);
        var timestamp = new Date().toLocaleString('en-ZA', options);
        $('#log').append('<b>' + timestamp + ' => </b>' + '<div>' + message + '</div>');
    };
    console.error = console.debug = console.info = console.log
}

function testLatency(connection, name) {
    var startTime = new Date().getTime();
    latencyTests[name] = {
        startTime: startTime,
        endTime: 0
    }
    $.connection.transports._logic.pingServer(connection, "")
        .done(() => {
            latencyResult(name);
        })
        .fail(() => {
            latencyFail(name);
        });
    setTimeout(() => {
        testLatency(connection, name);
    }, 10000);
}

function latencyResult(name) {
    var endTime = new Date().getTime();
    latencyTests[name].endTime = endTime;
    var latency = (latencyTests[name].endTime - latencyTests[name].startTime) / 2;
    var idx = chartKeys[name];
    for (var i = 1; i < 10; i++) {
        tableData[i][idx] = tableData[i + 1][idx];
    }
    tableData[10][idx] = latency;
    drawChart();
}

function latencyFail(name) {
    console.log("Latency test failed: " + name);
}

function startCharts() {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
}

var tableData = [
    ["Item", "Router", "Lobby"],
    ["1", 0, 0],
    ["2", 0, 0],
    ["3", 0, 0],
    ["4", 0, 0],
    ["5", 0, 0],
    ["6", 0, 0],
    ["7", 0, 0],
    ["8", 0, 0],
    ["9", 0, 0],
    ["10", 0, 0]
];

function drawChart() {

    // Create the data table.
    var data = google.visualization.arrayToDataTable(tableData);

    var options = {
        title: 'Latency',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}

