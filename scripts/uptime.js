  $( document ).ready(function(){
        var options = {
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                hour12: false
                };


        var routerTimeoutMilliSec = 35 * 1000;
        var url = "https://pd4router.installprogram.eu/pokerBabelFish";
        //var url = "https://mppgs1mobile.valueactive.eu/pokerBabelFish";
        var routerConnection = $.connection(url);
        routerConnection.start();
        $("#routerUpdateTime").text("Starting...");
        var routerTimer = setTimeout(function(){ $("#router").removeClass("up"); }, routerTimeoutMilliSec);
        routerConnection.received(function(data) {
            clearTimeout(routerTimer);
            var timestamp = new Date().toLocaleString('en-ZA', options);
            $("#routerUpdateTime").text(timestamp);
            $("#router").addClass("up");
            console.log("routerConn:" + data);
            routerTimer = setTimeout(function(){ $("#router").removeClass("up"); }, routerTimeoutMilliSec);
        });

       routerConnection.disconnected(function() {
            setTimeout(function() {
                routerConnection.start();
            }, 5000); // Restart connection after 5 seconds.
            });


        var lobbyTimeoutMilliSec = 35 * 1000;
        var url = "https://pd4lobby.installprogram.eu/pokerBabelFish"
        //var url = "https://mpplobby3mobile.valueactive.eu/pokerBabelFish";
        var lobbyConnection = $.connection(url);
        lobbyConnection.start();
         $("#lobbyUpdateTime").text("Starting...");
         var lobbyTimer = setTimeout(function(){ $("#lobby").removeClass("up"); }, lobbyTimeoutMilliSec);

        lobbyConnection.received(function(data) {
            clearTimeout(lobbyTimer);
            var timestamp = new Date().toLocaleString('en-ZA', options);
            $("#lobbyUpdateTime").text(timestamp);
            $("#lobby").addClass("up");
            console.log("lobbyConn:" +  data);
             lobbyTimer = setTimeout(function(){ $("#lobby").removeClass("up"); }, lobbyTimeoutMilliSec);
        });

        lobbyConnection.disconnected(function() {
            setTimeout(function() {
                lobbyConnection.start();
            }, 5000); // Restart connection after 5 seconds.
            });


       console.logCopy = console.log.bind(console);

        console.log = function()
        {
            // Timestamp to prepend
            var timestamp = new Date().toJSON();

            if (arguments.length)
            {
                // True array copy so we can call .splice()
                var args = Array.prototype.slice.call(arguments, 0);

                // If there is a format string then... it must
                // be a string
                if (typeof arguments[0] === "string")
                {
                    // Prepend timestamp to the (possibly format) string
                    args[0] = "%o: " + arguments[0];

                    // Insert the timestamp where it has to be
                    args.splice(1, 0, timestamp);

                    // Log the whole array
                    this.logCopy.apply(this, args);
                }
                else
                { 
                    // "Normal" log
                    this.logCopy(timestamp, args);
                }
            }
        };
    });