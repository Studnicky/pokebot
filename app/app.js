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

	var server = require('http').createServer(fileServer);	//	File server
	var io = require('./socket').listen(server);			//	Socket server

	//	slackHandler responds to slack events
	var slack = require('./slack');
	slack.initialize();

	server.listen(process.env.PORT, function(){
		console.log('Webserver listening on: ' + process.env.PORT );
	});

	//	Test DB methods to make sure they work

	// setInterval(function(){
	// 	db.user.pokemon.save('U09EUDR7G', '0');
	// }, 2000);

	// setTimeout(function(){
	// 	db.user.pokemon.get('U09EUDR7G', '1', function(this_pokemon){
	// 		console.log(this_pokemon.party_position + ': ' + this_pokemon.Pokemon.name);
	// 	});
	// }, 5000);

	// setInterval(function(){
	// 	db.user.pokemon.release('U09EUDR7G', Math.ceil(Math.random()*20), function(this_pokemon){
	// 		console.log(this_pokemon.party_position + ': ' + this_pokemon.Pokemon.name);
	// 	});
	// }, 10000);

	// setTimeout(function(){
	// 	db.user.party.get('U09EUDR7G', '1', function(party_members){
	// 		var replyMessage = "Your current party members are: \n";
	// 		party_members.map(function(member){
	// 			replyMessage += member.party_position+ ":\t:" + member.Pokemon.name;
	// 		});
	// 		console.log(replyMessage);
	// 	});

	// }, 5000);

	// setInterval(function(){
	// 	db.pokemon.spawn('255', function(this_pokemon){
	// 		console.log(this_pokemon.get());
	// 	});
	// }, 15000);

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