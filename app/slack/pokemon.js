"use strict";
var api = require(__dirname +'/../api');
var utility = require(__dirname +'/../utility');

var pokemon = {
	name: 'pokemon',
	events: function(controller, bot){

		var wild = false;
		var timerBase = 180000;	//	3 minutes
		var timerRand = 120000;	//	2 minutes
		var wildInstances = {};

		function setRarity (){ return Math.floor(Math.random()*254)+1; }
		function spawnTimer (){ return Math.floor(Math.random()*timerRand)+timerBase; }
		function escapeTimer (pokemon){ return Math.floor(Math.random()*15000+15000-55*pokemon.speed); }
		function wildPokemon (rarity){
			bot.startTyping;
			api.pokemon.spawn(rarity, function(err, response){
				if(err){ 
					return bot.reply(message, err);
				} else {
					var pokemon = response.pokemon;
					var instance = response.instance;
					var post = {
						channel: bot.general,
						username: ' ',
						icon_emoji: ':' + pokemon.name.toLowerCase() + (instance.is_shiny ? '-shiny' : '') + ':',
						text: "A wild  " + utility.pokemon_emoji(pokemon, instance) + " has appeared!"
					};

					bot.api.chat.postMessage(post, function(err, response) {
						if(err){ 	//	If the message didn't post properly, don't bother creating the instance
							console.log(err);
						} else {
							var timestamp = response.ts;
							wildInstances[timestamp] = {'pokemon':pokemon, 'instance': instance};
							wildInstances[timestamp].escapeTimer = escapeTimer(pokemon);

							setTimeout(function escape(){
								if(wildInstances[timestamp]){
									var post = {
										channel: bot.general,
										text: "Too slow!  " + utility.pokemon_emoji(wildInstances[timestamp].pokemon, wildInstances[timestamp].instance) + " got away!"
									}
									delete wildInstances[timestamp];
									bot.say(post);	//	@TODO:: This should have an engage counter and possible clearTimeout
								}
							}.bind(timestamp), wildInstances[timestamp].escapeTimer);
						}
					});
				}
			});
		}

		(function spawnLoop(){
			setTimeout(function spawnWild(){
				if(wild == true){ wildPokemon(setRarity()); }
				spawnLoop();
			}, spawnTimer());
		})();

		controller.on('reaction_added', function(bot, message){
			if(message.reaction.split('-')[0] == "pokeball" && wildInstances[message.item.ts]){
				var target = wildInstances[message.item.ts];
				var catch_chance = 100;
				var balltype = message.reaction.split('-')[1];
				var count = -1;
				var replies = [
					'<@' + message.user + '> missed ' + utility.pokemon_emoji(target.pokemon, target.instance) +  ' completely!',
					utility.pokemon_emoji(target.pokemon, target.instance) + ' broke free from <@' + message.user + '>\'s ball!',
					'<@' + message.user + '> was so close to catching ' + utility.pokemon_emoji(target.pokemon, target.instance) + '!',
					'<@' + message.user + '> just barely missed that ' + utility.pokemon_emoji(target.pokemon, target.instance) + '!',
					'Gotcha! <@' + message.user + '> caught ' + utility.pokemon_emoji(target.pokemon, target.instance) + '!'
				]
				
				switch(balltype){
					case ('master'):
						catch_chance = Infinity;
					case ('ultra'):
						catch_chance = catch_chance*2;
					case ('great'):
						catch_chance = catch_chance*1.5;
					//	Extend this logic to include ball-specific multipliers...
					case (''):
					default:
						break;
				}

				do {
					var shake = (Math.random()*255)+(10*count)-target.pokemon.catch_rate;
					var pass = catch_chance > shake ? true : false;
					count++;
				} while (count < 4 && pass);

				if(count < 4 || !(wildInstances[message.item.ts])){
					bot.reply(message.item, replies[count]);
				} else {
					delete wildInstances[message.item.ts];
					bot.reply(message.item, replies[4]);

					api.pokemon.capture(message.user, target.instance, position[0], function(err, response){
						if(saved_at < 7){
							replymessage = utility.pokemon_emoji(target.pokemon, target.instance) + " added to party at position " + saved_at + ".";
						} else {
							replymessage = utility.pokemon_emoji(target.pokemon, target.instance) + " sent to storage box " + utility.get_box(saved_at) + " at position " + utility.get_box_position(saved_at) + ".";
						}
						return bot.reply(message.item, replymessage);

					});
				}
			}
		});

		//	Spawn a wild pokemon on command (optional rarity force arg)
		controller.hears(['(spawn)\s*(.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			var rarity = typeof(message.match[1]) == 'undefined' ? parseInt(message.match[1]) : setRarity();
				rarity = (rarity >= 0 && rarity <= 255) ? rarity : 0;
			wildPokemon(rarity);
		});

		controller.hears(['set wild (true|false)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			api.user.get(message.user, function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					if(response.user.permissions_level >=3){
						wild = message.match[1];
						return bot.reply(message, 'Wild Pokemon spawning is now: ' + wild + '!');
					} else {
						return bot.reply(message, "Only admins can toggle app settings!");
					}
				}
			});
		});

		//	Pick a starter
		controller.hears(['(choose|pick|select) starter(s)? (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			bot.startTyping;
			var	starter = message.match[2];

			api.pokemon.starter_pick(message.user, starter, function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					var replymessage = "You've selected  " + utility.pokemon_emoji(response.pokemon, response.instance) + '! Good choice, <@' + message.user + '>!';
					return bot.reply(message, replymessage);
				}
			});

		});

		//	List all available starters
		controller.hears(['(list|show) starter(s)?'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			bot.startTyping;
			api.pokemon.starter_list(function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					var starter_list = {};
					response.starters.map(function(o){
						if(!starter_list[o.gen]){
							starter_list[o.gen] = [];
						};
						starter_list[o.gen].push(o);
					});
					var replymessage = "Available Starters List:\n";
					for (var key in starter_list){
						if(starter_list[key].length > 0){
							replymessage += utility.numeral_suffix(key) + ' Generation Starters:\n'
							starter_list[key].map(function(o){
								replymessage += "•\t:" + o.name.toLowerCase() + ": *" + o.name + "* \n";
							});
						}
					}
					return bot.reply(message, replymessage);
				}
			});
		});

	}
}

module.exports = pokemon;