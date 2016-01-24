//  Environment variables for local testing
if(!process.env.DATABASE_URL){
	var env = require('node-env-file');
	env(__dirname + '/../.env');
};

//	Initialize connection to database...
var postgres = require('./sequelize');
var db = require ('./db');				//	Database wrapper

postgres.sequelize.sync({force: true}, function(err){
	if(err){	//	No database? No server.
		console.error(err);
		return process.exit(1);
	}
}).then(function(){

	//	Temporary seeding...
	var seeds = require(__dirname + '/../seed.json');
	seeds.map(function(o){
		postgres.Pokemon.upsert(o)
		.then(function(){
			// console.log("Stored:\t" + o.name);
		})
		.catch(function(error){
			// console.log("Failed to store: " + o.name + "\n" + error);
		});
	});

	var slack = require('./slack');							//	Slack handler

	var server = require('http').createServer(fileServer);	//	File server
	var io = require('./socket').listen(server);			//	Socket server

	server.listen(process.env.PORT, function(){
		console.log('Webserver listening on: ' + process.env.PORT );
	});
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
		}
		response.writeHead(200);
		response.end(data);
	});
}