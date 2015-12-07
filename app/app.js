var app = require('http').createServer(newServer)
var io = require('socket.io')(app);
var fs = require('fs');

//  Environment variables for local testing
var env = require('node-env-file');
env(__dirname + '/../.env');

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

//	Example socket script
io.on('connection', function (socket) {
	console.log('Connection made.');
	
	socket.emit('outgoing', {outgoing: "sample outoging data"});

	socket.on('incoming', function (data) {
		console.log(data);
	});
	
});

//	Create server
app.listen(process.env.PORT, function(){
	console.log('Server listening on: ' + process.env.PORT );
});
