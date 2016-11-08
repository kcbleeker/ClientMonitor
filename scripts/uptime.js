var options = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false
};

$(document).ready(function () {
    setupRouterMonitor();
    setupLobbyMonitor();
    setupLogging();
});

function setupRouterMonitor() {
    var routerTimeoutMilliSec = 35 * 1000;
    //var url = "https://pd4router.installprogram.eu/pokerBabelFish";
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
        console.log("routerConn:" + data);
        routerTimer = setTimeout(function () { $("#router").removeClass("up"); }, routerTimeoutMilliSec);
    });

    routerConnection.disconnected(function () {
        setTimeout(function () {
            routerConnection.start();
        }, 5000); // Restart connection after 5 seconds.
    });

    routerConnection.error(function (error) {
        $("#router").removeClass("up");
        $("#routerUpdateTime").text("ERROR");
        console.log('Router SignalR error: ' + error)
    });
}

function setupLobbyMonitor() {
    var lobbyTimeoutMilliSec = 35 * 1000;
    //var url = "https://pd4lobby.installprogram.eu/pokerBabelFish"
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
        console.log("lobbyConn:" + data);
        lobbyTimer = setTimeout(function () { $("#lobby").removeClass("up"); }, lobbyTimeoutMilliSec);
    });

    lobbyConnection.disconnected(function () {
        setTimeout(function () {
            lobbyConnection.start();
        }, 5000); // Restart connection after 5 seconds.
    });

    lobbyConnection.error(function (error) {
        $("#lobby").removeClass("up");
        $("#lobbyUpdateTime").text("ERROR");
        console.log('Lobby SignalR error: ' + error)
    });
}

function setupLogging() {
    if (typeof console != "undefined")
        if (typeof console.log != 'undefined')
            console.olog = console.log;
        else
            console.olog = function () { };

    console.log = function (message) {
        console.olog(message);
        $('#log').append('<p>' + message + '</p>');
    };
    console.error = console.debug = console.info = console.log
}