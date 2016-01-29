//  Environment variables for local testing
if(!process.env.DATABASE_URL){
	var env = require('node-env-file');
	env(__dirname + '/../.env');
};
//	Initialize connection to database...
var postgres = require('./sequelize');

//	Instantiate API
var api = require ('./api');

postgres.sequelize.sync(function(err){
	if(err){	//	No database? No server.
		console.error(err);
		return process.exit(1);
	}
}).then(function(){

	var http = require('http');
	var slack = require('./slack');							//	Slack handler
	var server = http.createServer(fileServer);				//	File server
	var io = require('./socket').listen(server);			//	Socket server

	//	Start web server for front-end...
	server.listen(process.env.PORT, function(){
		console.log('** Webserver listening on: ' + process.env.PORT );
	});

	//	Keep Heroku process alive by pinging it every 10 minutes (600000ms)
	setInterval(function herokukeepalive(){
		console.log('** Keepalive ping');
		http.get(process.env.KEEPALIVE_ENDPOINT);
	}, 600000);

});

//	Instantiate webserver
function fileServer (request, response) {
	var path = require('path');
	var fs = require('fs');

	//	Serve index for root and other files on request
	var url = request.url == '/' ? 'index.html' : request.url;
	fs.readFile(path.join(__dirname, '/../public/', url), function (err, data) {
		if (err) {
			response.writeHead(500);
			return response.end('Unable to load ' + url);
		} else {
			response.writeHead(200);
			return response.end(data);
		}
	});
}