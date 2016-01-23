var db = require(__dirname +'/../db');
var utility = require(__dirname +'/../utility');
var token = process.env.REALTIME_SLACK_TOKEN;

var pokemon = {
	name: 'pokemon',
	events: function(controller, bot){
		var wild = true;
		var wildInstances = {};
		var setRarity = function(){
			return Math.floor(Math.random()*254)+1;
		}
		var spawnTimer = function(){
			return Math.floor(Math.random()*120000)+180000;
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
										text: "Too slow!  " + ':' + pokemon.name.toLowerCase() + (instance.is_shiny ? '-shiny' : '') + ':' + "  *" + pokemon.name + "* got away!"
									}
									bot.say(post);
									//	Have to do oAuth to get scope for editing/deleting messages and not feeling it
									// var update = {token: token,	ts: timestamp, channel: "C09EUKXHT", text: "Too slow!"};
									// bot.api.chat.update(update, function(err, data){
									// 	if(!err){ console.log(data); }
									// 	else { console.log(err); }
									// });	
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
						default:
							console.log(catch_chance);
							break;
					}

				var count = 0;
				do {
					var shake = (Math.random()*255)+(10*count)-target.pokemon.catch_rate;
					console.log('Count ' + count + ' Shake ' + shake);
					console.log('Catch_rate ' + target.pokemon.catch_rate + ' catch_chance ' + catch_chance);
					var pass = catch_chance > shake ? true : false;
					console.log(pass); 
					count++;
				} while (count < 4 && pass);

				var emoji = ':' + target.pokemon.name.toLowerCase() + (target.instance.is_shiny ? '-shiny' : '') + ':';

				var messages = [
					'<@' + message.user + '> missed ' + emoji + '  *' + target.pokemon.name + '* completely!',
					emoji + ' *' + target.pokemon.name + '* broke free from <@' + message.user + '>\'s ball!',
					'<@' + message.user + '> was so close to catching ' + emoji + '  *' + target.pokemon.name + '*!',
					'<@' + message.user + '> just barely missed that ' + emoji + '  *' + target.pokemon.name + '*!',
					'Gotcha! <@' + message.user + '> caught  ' + emoji + '  *' + target.pokemon.name + '*!'
				]

				if(count < 4 || !(wildInstances[message.item.ts])){
					bot.reply(message.item, messages[count]);
				} else {
					delete wildInstances[message.item.ts];
					bot.reply(message.item, messages[4]);
					db.party.find_open_position(message.user, function(position){
						if(position.length < 1){
							return bot.reply(message.item, "You cannot store any more Pokemon!");
						} else {
							db.pokemon.capture(message.user, target.instance, position, function(saved_at){
								return bot.reply(message.item, saved_at);
							});
						}
					});
				}
			}
		});

		//	Get user party
		controller.hears(['spawn (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			var rarity = parseInt(message.match[1]);
			var rarity = (typeof(rarity) == 'number' && rarity >= 0 && rarity <= 255) ? rarity : 0;
			wildPokemon(rarity);
		});

		controller.hears(['Spawning (true|false)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			db.user.get_info(message.user, function(this_user){
				if(this_user.permissions_level >= 3){
					wild = message.match[1];
					return bot.reply(message, "Wild pokemon spawning is now: " + wild);
				} else {
				return bot.reply(message, "Insufficient user permissions");
				}
			});
		});

		//	Get user party
		controller.hears(['spawn (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			var rarity = parseInt(message.match[1]);
			var rarity = (typeof(rarity) == 'number' && rarity >= 0 && rarity <= 255) ? rarity : 0;
			wildPokemon(rarity);
		});

		//	Get user party
		controller.hears(['starter(s)? pick (.*)'],['direct_message'],function(bot,message) {
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
									if(message.match[2] == o.name){pokemon = o;}
								});
								if(pokemon == null){
									return bot.reply(message, message.match[2] + " is not available as a starter!");
								} else {
									db.pokemon.build_instance(pokemon, function(this_instance){
										db.pokemon.capture(message.user, this_instance, position, function(saved_at){
											return bot.reply(message, saved_at);
										});
									});
								}
							});
						}
					});
				}
			});
		});

		//	Get user party
		controller.hears(['starter(s)? (get|list)'],['direct_message'],function(bot,message) {
			bot.startTyping;

			db.pokemon.starter_list(function(list){
				starter_list = {};

				list.map(function(o){
					if(!starter_list[o.gen]){
						starter_list[o.gen] = [];
					};
					starter_list[o.gen].push(o);
				});

				var replyMessage = "Available Starters List:\n";

				for (var key in starter_list){
					if(starter_list[key].length > 0){
						console.log(key);
						replyMessage += utility.numeral_suffix(key) + ' Generation Starters:\n'
						starter_list[key].map(function(o){
							console.log(o);
							replyMessage += "•\t:" + o.name.toLowerCase() + ": " + o.name + " \n";
						});
					}
				}

				bot.reply(message, replyMessage);

			});

		});

		//	Get user party
		controller.hears(['pokemon (release|delete) (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {

			console.log(message);

			message.match.map(function(e,i,a){
				bot.reply(message, "Message match: " + i + " = " + e);
			}.bind(message));

		});


		//	Get user party
		controller.hears(['pokemon (get|info) (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {

			console.log(message);

			message.match.map(function(e,i,a){
				bot.reply(message, "Message match: " + i + " = " + e);
			}.bind(message));

		});

	}
}

module.exports = pokemon;
