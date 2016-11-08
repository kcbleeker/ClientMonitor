var options = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false
};

$(document).ready(function () {
    setupRouterMonitor();
    setupLobbyMonitor();
});

function setupRouterMonitor() {
    var routerTimeoutMilliSec = 35 * 1000;
    //var url = "https://pd4router.installprogram.eu/pokerBabelFish";
    var url = "https://mppgs1mobile.valueactive.eu/pokerBabelFish";
    var routerConnection = $.connection(url);
    routerConnection.start();
    $("#routerUpdateTime").text("Starting...");
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
}

function setupLobbyMonitor() {
    var lobbyTimeoutMilliSec = 35 * 1000;
    //var url = "https://pd4lobby.installprogram.eu/pokerBabelFish"
    var url = "https://mpplobby3mobile.valueactive.eu/pokerBabelFish";
    var lobbyConnection = $.connection(url);
    lobbyConnection.start();
    $("#lobbyUpdateTime").text("Starting...");
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
}