//  Environment variables for local testing
if(!process.env.DATABASE_URL){
	var env = require('node-env-file');
	env(__dirname + '/../.env');
};

var postgres = require('./sequelize');
var api = require ('./api');

postgres.sequelize.sync(function(err){						//	Sequelize reads data?
	if(err){												//	No database? No server.
		console.error(err);
		return process.exit(1);
	}
}).then(function(){

	var http = require('http');
	var slack = require('./slack');							//	Slack controller
	var expressApp = require('./express');					//	Express server
	var io = require('./socket');							//	Socket server

	var expressServer = http.createServer(expressApp);		//	Make http server
	expressServer.listen(process.env.PORT);					//	Tell Express to listen
	io.listen(expressServer);								//	Tell IO to listen, too

	setInterval(function herokukeepalive(){  				//	Ping Heroku every 10 minutes (600000ms)
		console.log('** Keepalive ping');
		http.get(process.env.KEEPALIVE_ENDPOINT);
	}, 600000);


});