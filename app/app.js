//	Primary dependencies
var app = require('http').createServer(newServer)
var io = require('socket.io')(app);
var fs = require('fs');

//  Environment variables for local testing
if(!process.env.DATABASE_URL){
	var env = require('node-env-file');
	env(__dirname + '/../.env');
}

//	Connect to postgres and run init
var postgres = require ('./sequelize');
	postgres.initialize();

//	Call in the slackHandler
var slackHandler = require('./slack');
	slackHandler.initialize();

//	Example socket script
io.on('connection', function (socket) {
	console.log('Socket Connected!');

	// var socketHandlers = {
	// 	socketEvents: {
	// 		userListener: new UserListener();
	// 	},
	// 	initialize: function(){

	// 	},
	// 	dispatch_events: function(){
	// 		for (var event in socketEvents){
	// 			var handler = socketEvents[event]
	// 		}
	// 	}
	// };

	socket.on('get-user-presence', function (data) {
		console.log(data);
		slackHandler.get_active_users(function(active_users){
			socket.emit('return-user-presence', {outgoing: active_users});
		})
		
	});

});

//	Create server
app.listen(process.env.PORT, function(){
	console.log('Webserver listening on: ' + process.env.PORT );
});



//	Instantiate webserver
function newServer (req, res) {

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