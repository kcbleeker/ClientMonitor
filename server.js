var me = "http://127.0.0.1/index.htm"

// HOST THE MONITOR

var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var serve = serveStatic("./wwwroot");
var server = http.createServer(function (req, res) {
	var done = finalhandler(req, res);
	serve(req, res, done);
	console.log("Page loaded remotely");
});
server.listen(80);

// RUN THE BROWSER
function startMonitor() {
	var driver = require('node-phantom-simple');
	driver.create({ path: require('phantomjs').path, parameters: { 'web-security': 'false' } }, function (err, browser) {
		return browser.createPage(function (err, page) {
			// page.onResourceReceived = function (response) {
			// 	console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response));
			// };
			// page.onResourceRequested = function (requestData, networkRequest) {
			// 	console.log(requestData, networkRequest);
			// };
			// page.onConsoleMessage = function (msg, lineNum, sourceId) {
			// 	console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
			// };
			// page.onError = function (msg, trace) {

			// 	var msgStack = ['ERROR: ' + msg];

			// 	if (trace && trace.length) {
			// 		msgStack.push('TRACE:');
			// 		trace.forEach(function (t) {
			// 			msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
			// 		});
			// 	}

			// 	console.error(msgStack.join('\n'));

			// };

			return page.open(me, function (err, status) {
				console.log("opened site? ", status);
				setTimeout(function () {
					// page.get('content', function (err, html) {
					// 	console.log("Page HTML is: " + html);
					// });
				}, 10000)
				setTimeout(function () {
					browser.exit();
					startMonitor();
				}, 3600000)
			});
		});
	});
}
startMonitor();
