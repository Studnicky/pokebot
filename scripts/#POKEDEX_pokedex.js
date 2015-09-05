//	Description:
//	Retrieve Pokemon message from pokeapi endpoint.
//
//	Dependencies:
//	Request
//
//	Configuration:
//	None
//
//	Commands:
//	hubot pokedex <query> - Return pokedex message from pokeapi.co by name or national pokedex number
//
//	Author:
//	Andrew Studnicky

//	Refer here for how to make Hubot send preformatted attachments:
//	https://github.com/inkel/hubot-slack-attachment
//	https://api.slack.com/docs/attachments


//	Get the utility functions
var Utilities = require('./utility');

module.exports = function pokedex(robot) {

	//	Build return request
	return robot.respond(/pokedex(.*)/i, function(res) {

		//	Only do this in the pokedex channel or DM
		if (res.message.room == "pokedex" || res.message.room == res.message.user.name) {

			//	Get the user query, strip colons if they exist so people can use the emotes for fun
			var pokemon = res.match[1].replace(/:$/,'').toLowerCase().trim();

			if (pokemon.length > 0) {

				//	TODO:: We should have these all in our database, so change these to internal sequelize calls.
				//	Maybe leave the picture get?

				var api_end_point = 'http://pokeapi.co/api/v1/pokemon/';
				robot.http(api_end_point).header('Accept', 'application/json').get(pokemon)(function(err, reponse, body) {

				//	Base the reply on the response status code...
					switch(true){
						
						//	Good reply
						case (reponse.statusCode == 200):
							reply_message = parseReply(body); 
							res.send(reply_message);
							break;
						
						//	Server offline?
						case (reponse.statusCode >= 300 && res.statusCode < 400):
							res.reply('I\'m sorry, I seem to have misplaced that message.');
							break;
						
						//	Unrecognized request
						case (reponse.statusCode >= 400 && res.statusCode < 500):
							res.reply('I didn\'t understand you, did you spell that right?');
							break;
						
						//	Internal error
						case(reponse.statusCode>=500):
							res.reply('It seems I\'ve forgotten that.');
							break;
						
						//	Unknown bad reply
						case 'default':
							res.reply('Hmm, try asking again later.');
					}
				});

			} else {

				//	Null or no pattern matched.
				res.reply('Tell me a name or _National Pokedex ID_ of a Pokémon to learn about it!');

			}
		}

	});

	function parseReply(json) {
		
		var data = JSON.parse(json);

		//	This is a bit hacky, but it returns the pokemon's picture from the API without making a second call.
		var message = 'http://pokeapi.co/media/img/' + data.objects[0].national_id + '.png\n' + '*Name:*\t\t\t' +  data.objects[0].name + '\n\n';
		//	Types may contain one or two objects, so this has to be a bit weird...
		message += '*Type*:\t\t\t';
		data.objects[0].types.map(function(o){
			message += Utilities.proper_capitalize(o.name) + ' ';
		});
		message += '\n\n';
		//	Make power level bars for stats because they're fun!
		[	//	Dict obj sets display strings for keys
			{attack:"Attack"},
			{defense:"Defense"},
			{hp:"Hit points"},
			{speed:"Speed"},
			{sp_def:"Special Defense"},
			{sp_atk:"Special Attack"}
		].map(function(obj){
			//	Iterate desired keys, generate string with ASCII powerbar
			for (var key in obj){
				var bar_len = data.objects[0][key]/10;
				var bar = '', tabs = '\t', count = 0;
				do {
					bar += '█';
					count++;
				} while(count < bar_len);
				if (obj[key].length < 14){
					tabs += "\t";
				}
				message += '*' + obj[key] + '*:' + tabs + data.objects[0][key] + '\n' + bar + '\n\n';
			}
		});
		return (message);
	}
};
