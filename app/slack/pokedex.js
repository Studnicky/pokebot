var api = require(__dirname +'/../api');
var utility = require(__dirname +'/../utility');
var path = require('path');
var fs = require('fs');

var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	Pokemon = Models.Pokemon;

var pokedex = {
	name: 'pokedex',
	events: function(controller, bot){

		//	List all emotes (!Debugging tool to find missing sprites)
		// controller.hears(['emotes'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
		// 	Pokemon.findAll({
		// 		order: [['national_id', 'ASC']],
		// 	}).then(function(all_pokemon){
		// 		if(all_pokemon){
		// 			var list = '';
		// 			all_pokemon.map(function(pokemon){
		// 				list += (utility.pokemon_emoji(pokemon) + "\n");
		// 			});
		// 			var post = {
		// 				channel: bot.rooms.pokedex,
		// 				username: 'Pokedex',
		// 				icon_emoji: ':pokedex:',
		// 				text: list
		// 			};
		// 			bot.say(post);
		// 		} else {
		// 			err = 'No Pokemon found!';
		// 		}
		// 	}).catch(function(err){
		// 		console.log(err);
		// 	});
		// });

		//	Get Pokedex info from an input
		controller.hears(['pokedex (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			var identifier = message.match[1];
			makeResponse(identifier, function(err, response){
				if(err){
					console.log(err);
				} else {
					var post = {
						channel: bot.rooms.pokedex,
						username: 'Pokedex',
						icon_emoji: ':pokedex:',
						attachments: JSON.stringify(response.pokedexEntry),
						text: ' '
					};
					bot.api.chat.postMessage(post, function(err, response) {
						if(err){
							console.log(err);
						} else {
							/*	Do nothing? */
						};
					});
				}
			});
		});

		//	Get pokedex info by reading a message
		controller.on('reaction_added', function(bot, message){
			if(message.reaction == "pokedex"){
				var query = {
					channel: message.item.channel,
					latest: message.item.ts,
					oldest: message.item.ts,
					inclusive: 1,
					count: 1
				};
				//	Find the message...
				bot.api.channels.history(query, function(err, response) {
					if(err){
						console.log(err);
					} else {
						var identifier = null;
						response.messages.map(function(message){	//	There should only be one but who knows?
							identifier = (message.text.match(/:(.*?):/)) ? message.text.match(/:(.*?):/)[0] : null;
						});
						if(identifier){
							identifier = identifier.replace(/:/g,'');
							makeResponse(identifier, function(err, response){
								if(err){
									console.log(err);
								} else {
									var post = {
										channel: bot.rooms.pokedex,
										username: 'Pokedex',
										icon_emoji: ':pokedex:',
										attachments: JSON.stringify(response.pokedexEntry),
										text: ' '
									};
									bot.api.chat.postMessage(post, function(err, response) {
										if(err){
											return console.log(err);
										} else {
											/*	Do nothing? */
										};
									});
								}
							});
						}
					};
				});
			}
		});
	}
}

module.exports = pokedex;

function makeResponse(identifier, callback){
	api.pokedex.get(identifier, function(err, response){
		if(err){
			return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
		} else {
			var replymessage = 'info';
			var fields = [];

			fields.push({
				"title": "Average Height:",
				"value": (response.pokemon.height/10)+"m",
				"short": true
			});
			fields.push({
				"title": "Average Weight:",
				"value": (response.pokemon.weight/10)+"lbs",
				"short": true
			});
			// console.log(response.pokemon.abilities);
			var typeString = '';
			response.pokemon.types.map(function(type, i, a){
				typeString += utility.proper_capitalize(type.type);
				typeString += (i<a.length-1) ? ", " : "";
			});
			fields.push({
				"title": (response.pokemon.types.length > 1) ? "Types:" : "Type:",
				"value": typeString,
				"short": false
			});

			var statString = '';
			for (var key in response.pokemon.stats){
				fields.push({
					"title": "Base " + key.replace("-"," ") + ":",
					"value": response.pokemon.stats[key], // makePowerBar(key, response.pokemon.stats[key]);
					"short": true
				});
			}
			
			var evolutionString = '';
			if(response.pokemon.evolutions[0].name != null){
				response.pokemon.evolutions.map(function(evolution){
					evolutionString += (':' + evolution.name.toLowerCase() + ': ' + utility.proper_capitalize(evolution.name) + '  ');
				});
				fields.push({
					"title": (response.pokemon.evolutions.length > 1) ? "Possible Evolutions:" : "Evolution:",
					"value": evolutionString,
					"short": false
				});
			}
			var pokedexEntry = [{
				"fallback": "Pokedex entry for " + response.pokemon.name,
				"color": "#AC2624",
				"title": utility.proper_capitalize(response.pokemon.name),
				"text": "",	//	Pokedex prose here
				"fields": fields,
				"thumb_url": path.join(__dirname, "/../../public/assets/pkmn/", response.pokemon.name + '.gif')	//	Not the end of the world if this doesn't work
			}];
			var response = {'pokedexEntry': pokedexEntry};
			return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
		}
	});
}

// function makePowerBar (stat, value){
// 	var bar = '', count = 0;
// 	var bar_len = value/10;
// 	var reply = (stat.replace("-"," ").toUpperCase() + ': ' + value + '\n');
// 	console.log(reply.length);
// 	do {
// 		bar += '█';
// 		count++;
// 	} while(count < bar_len);
// 	return (reply + bar + '\n');
// };