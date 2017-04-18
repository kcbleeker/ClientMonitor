var me = "http://127.0.0.1:";

// HOST THE MONITOR
var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var serve = serveStatic("./app");
var server = http.createServer(function (req, res) {
	if (req.url === "/") {
		req.url = "index.htm";
	}
	var done = finalhandler(req, res);
	serve(req, res, done);

});

server.listen(process.env.PORT || 8080);
me = me + (process.env.PORT || 8080);
console.log("opened me? ", me);
// RUN THE BROWSER
function startMonitor() {
	var driver = require('node-phantom-simple');
	driver.create({ path: require('phantomjs').path, parameters: { 'web-security': 'false' } }, function (err, browser) {
		return browser.createPage(function (err, page) {
			return page.open(me, function (err, status) {
				console.log("opened site? ", status);

				setTimeout(function () {
					browser.exit();
					startMonitor();
				}, 3600000)
			});
		});
	});
}
startMonitor();
