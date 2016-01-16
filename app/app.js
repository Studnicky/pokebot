//	Primary dependencies
var app = require('http').createServer(webServer)
var io = require('socket.io')(app);
var fs = require('fs');

//  Environment variables for local testing
if(!process.env.DATABASE_URL){
	var env = require('node-env-file');
	env(__dirname + '/../.env');
}

//	DB handler uses sequelize to connect to postgres and run init
var db = require ('./db');
	db.initialize();

//	slackHandler responds to slack events
var slack = require('./slack');
	slack.initialize();

//	sockethandler responds to web server events
var socket = require('./socket');
	socket.initialize(io);

app.listen(process.env.PORT, function(){
	console.log('Webserver listening on: ' + process.env.PORT );
});

//	Instantiate webserver
function webServer (req, res) {

	//	Serve index for single page app
	var statics = req.url;
	if (req.url == '/') {
		statics = 'index.html'
	}
	//	Fetch the requested file
	fs.readFile(__dirname + '/../public/' + statics, function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Unable to load ' + statics);
		}
		res.writeHead(200);
		res.end(data);
	});
}