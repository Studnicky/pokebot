var db = require(__dirname +'/../db');
var utility = require(__dirname +'/../utility');
var token = process.env.REALTIME_SLACK_TOKEN;

var pokemon = {
	name: 'pokemon',
	events: function(controller, bot){
		var wild = false;
		var timerBase = 180000;	//	3 minutes
		var timerRand = 120000;	//	2 minutes
		var wildInstances = {};

		var setRarity = function(){
			return Math.floor(Math.random()*254)+1;
		}
		var spawnTimer = function(){
			return Math.floor(Math.random()*timerRand)+timerBase;
		}
		var escapeTimer = function(pokemon){
			return Math.floor(Math.random()*15000+15000-55*pokemon.speed);
		}
		var wildPokemon = function(rarity){
			bot.startTyping;
			db.pokemon.spawn(rarity, function(pokemon){
				db.pokemon.build_instance(pokemon, function(instance){
					var post = {
						token: token,
						channel: "C09EUKXHT",
						username: ' ',
						icon_emoji: ':' + pokemon.name.toLowerCase() + (instance.is_shiny ? '-shiny' : '') + ':',
						text: "A wild  " + ':' + pokemon.name.toLowerCase() + (instance.is_shiny ? '-shiny' : '') + ':' + "  *" + pokemon.name + "* has appeared!"
					};
					bot.api.chat.postMessage(post, function(err, data) {
						if(!err){
							var timestamp = data.ts;
							wildInstances[timestamp] = {
								'pokemon': pokemon,
								'instance': instance,
								'escapeTimer': escapeTimer(pokemon.get())
							};
							setTimeout(function escape(){
								if(wildInstances[timestamp]){	
									delete wildInstances[timestamp];
									var post = {
										toke: token,
										channel: "C09EUKXHT",
										text: "Too slow!  " + utility.pokemon_emoji(pokemon, instance) + " got away!"
									}
									bot.say(post);
								}
							}.bind(timestamp), wildInstances[timestamp].escapeTimer);
						} else {
							console.log(err);
						}
					});
				});
			});
		};

		(function spawnLoop(){
			setTimeout(function(){
				if(wild == true){
					wildPokemon(setRarity());
				}
				spawnLoop();
			}, spawnTimer());
		})();

		controller.on('reaction_added', function(bot, message){
			if(message.reaction.split('-')[0] == "pokeball" && wildInstances[message.item.ts]){
				var target = wildInstances[message.item.ts];
				var catch_chance = 100;
				var balltype = message.reaction.split('-')[1];
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

				var count = -1;
				do {
					var shake = (Math.random()*255)+(10*count)-target.pokemon.catch_rate;
					var pass = catch_chance > shake ? true : false;
					count++;
				} while (count < 4 && pass);

				var responses = [
					'<@' + message.user + '> missed ' + utility.pokemon_emoji(target.pokemon, target.instance) +  ' completely!',
					utility.pokemon_emoji(target.pokemon, target.instance) + ' broke free from <@' + message.user + '>\'s ball!',
					'<@' + message.user + '> was so close to catching ' + utility.pokemon_emoji(target.pokemon, target.instance) + '!',
					'<@' + message.user + '> just barely missed that ' + utility.pokemon_emoji(target.pokemon, target.instance) + '!',
					'Gotcha! <@' + message.user + '> caught ' + utility.pokemon_emoji(target.pokemon, target.instance) + '!'
				]

				if(count < 4 || !(wildInstances[message.item.ts])){
					bot.reply(message.item, responses[count]);
				} else {
					delete wildInstances[message.item.ts];
					bot.reply(message.item, responses[4]);
					db.party.find_open_position(message.user, function(position){
						if(position.length < 1){
							return bot.reply(message.item, "You cannot store any more Pokemon!");
						} else {
							db.pokemon.capture(message.user, target.instance, position[0], function(saved_at){
								if(saved_at < 7){
									response = utility.pokemon_emoji(target.pokemon, target.instance) + " added to party at position " + saved_at + ".";
									return bot.reply(message.item, response);
								} else {
									response = utility.pokemon_emoji(target.pokemon, target.instance) + " sent to storage box " + utility.get_box(saved_at) + " at position " + utility.get_box_position(saved_at) + ".";
									return bot.reply(message.item, response);
								}
							});
						}
					});
				}
			}
		});

		//	Spawn a wild pokemon on command (optional rarity force arg)
		controller.hears(['spawn\s*(.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			var rarity = typeof(message.match[1]) == 'undefined' ? parseInt(message.match[1]) : setRarity();
				rarity = (rarity >= 0 && rarity <= 255) ? rarity : 0;
			wildPokemon(rarity);
		});

		controller.hears(['spawning (true|false)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			db.user.get_info(message.user, function(user){
				if(user.permissions_level >= 3){
					wild = message.match[1];
					return bot.reply(message, "Wild pokemon spawning is now: " + wild);
				} else {
					return bot.reply(message, "Insufficient user permissions");
				}
			});
		});

		//	Pick a starter
		controller.hears(['starter(s)? pick (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			bot.startTyping;
			var	pokemon = null;

			db.party.count(message.user, function(count){
				if(count > 0){
					return bot.reply(message, "You already have a Pokemon!");
				} else {
					db.party.find_open_position(message.user, function(position){
						if(position.length < 1){
							return bot.reply(message, "You cannot store any more Pokemon!");
						} else {
							db.pokemon.starter_list(function(starters){
								starters.map(function(o){
									if(utility.proper_capitalize(message.match[2]) == o.name){pokemon = o;}
								});
								if(pokemon == null){
									return bot.reply(message, message.match[2] + " is not available as a starter!");
								} else {
									db.pokemon.build_instance(pokemon, function(instance){
										db.pokemon.capture(message.user, instance, position[0], function(saved_at){
											var response = "You've selected  " + utility.pokemon_emoji(pokemon, instance) + '! Good choice, <@' + message.user + '>!';
											return bot.reply(message, response);
										});
									});
								}
							});
						}
					});
				}
			});
		});

		//	List all available starters
		controller.hears(['starter(s)? (get|list)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			bot.startTyping;
			db.pokemon.starter_list(function(list){
				starter_list = {};
				list.map(function(o){
					if(!starter_list[o.gen]){
						starter_list[o.gen] = [];
					};
					starter_list[o.gen].push(o);
				});
				var response = "Available Starters List:\n";
				for (var key in starter_list){
					if(starter_list[key].length > 0){
						response += utility.numeral_suffix(key) + ' Generation Starters:\n'
						starter_list[key].map(function(o){
							response += "•\t:" + o.name.toLowerCase() + ": " + o.name + " \n";
						});
					}
				}
				return bot.reply(message, response);
			});

		});

	}
}

module.exports = pokemon;