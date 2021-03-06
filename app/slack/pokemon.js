var api = require(__dirname +'/../api');
var utility = require(__dirname +'/../utility');

var pokemon = {
	name: 'pokemon',
	events: function(controller, bot){

		var wild = true;
		var spawnTimer = 1000;
		var wildInstances = {};

		function doSpawn(){
			var rarity = Math.floor(Math.random()*254)+1;
			api.pokemon.spawn(rarity, function(err, response){
				if(err){ 
					return console.log(err);
				} else {
					var pokemon = response.pokemon;
					var instance = response.instance;
					var post = {
						channel: bot.rooms.general,
						username: ' ',
						icon_emoji: ':' + pokemon.name.toLowerCase() + (instance.is_shiny ? '-s' : '') + ':',
						text: "A wild  " + utility.pokemon_emoji(pokemon, instance) + " has appeared!"
					};
					bot.api.chat.postMessage(post, function(err, response) {
						if(err){ 	//	If the message didn't post properly, don't bother creating the instance
							console.log(err);
						} else {
							var timestamp = response.ts;
							var baseEscape = 30000;
							var randEscape = Math.floor(Math.random()*15000);
							var speedMult = 55*pokemon.stats.speed;
							wildInstances[timestamp] = {'pokemon':pokemon, 'instance': instance, 'escapeTimer': (baseEscape+randEscape-speedMult)};

							setTimeout(function escape(){
								if(wildInstances[timestamp]){
									var post = {
										channel: bot.rooms.general,
										text: "Too slow!  " + utility.pokemon_emoji(wildInstances[timestamp].pokemon, wildInstances[timestamp].instance) + " got away!"
									};
									delete wildInstances[timestamp];
									bot.say(post);	//	@TODO:: This should have an engage counter and possible clearTimeout
								}
							}.bind(timestamp), wildInstances[timestamp].escapeTimer);
						}
					});
				}
			});
		}

		(function spawn(){
			setTimeout(function(){
				var timerBase = 900000;		//	base 15 minutes
				var timerRand = 900000;		//	rand up to 15 minutes
				var timer = Math.floor(Math.random()*timerRand)+timerBase;
				//	How many users are here?
				bot.api.users.list({token: bot.token, presence: 1},function(err,response) {
					if(err){
						return console.log(err);
					} else {			
						var userCount = response.members.filter(function(user){
							return (user.presence == "active") && (user.presence != "undefined") && (user.is_bot !== true);
						});				
						var multTimer = Math.log2(userCount.length+1)+1;	//	2^x == users, do not allow zero or return zero
						spawnTimer = (timer/multTimer);
						//	EFFECTIVE TIMERS: 
						//	userCount=0		(15-30 mins)
						//	userCount=10	(3.5-7 mins)
						//	userCount=100	(2-4 mins)
						//	userCount=1000	(1.5-3 mins)
						if(wild === true){
							doSpawn();
						}
					}
					spawn();	//	Repeat in recursion
				});
			}, spawnTimer);
		})();

		controller.on('reaction_added', function(bot, message){
			bot.reply(message, {"type": "typing"});
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
					var shake = (Math.random()*255)+(10*count)-target.pokemon.capture_rate;
					var pass = catch_chance > shake ? true : false;
					count++;
				} while (count < 4 && pass);

				if(count < 4 || !(wildInstances[message.item.ts])){
					bot.reply(message.item, replies[count]);
				} else {
					delete wildInstances[message.item.ts];
					bot.reply(message.item, replies[4]);
					api.pokemon.capture(message.user, target.instance, function(err, response){
						if(err){
							return bot.reply(message, err);
						} else {
							var reply = '';
							if(response.position < 7){
								reply += utility.pokemon_emoji(target.pokemon, target.instance) + " added to party at position " + response.position + ".";
							} else {
								reply += utility.pokemon_emoji(target.pokemon, target.instance) + " sent to storage box " + utility.get_box(response.position) + " at position " + utility.get_box_position(response.position) + ".";
							}
						}
						return bot.reply(message.item, reply);
					});
				}
			}
		});

		//	Admin toggle for wild pokemon spawning
		controller.hears(['set wild (true|false)'],['direct_message','direct_mention','mention'],function(bot,message) {
			api.users.get(message.user, function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					if(response.user.permissions_level >= 3){
						wild = (message.match[1] == 'true') ? true : false;
						return bot.reply(message, 'Wild Pokemon spawning is now: ' + wild + '!');
					} else {
						return bot.replyPrivate(message, "Only admins can toggle app settings!");
					}
				}
			});
		});

		//	Spawn a wild pokemon on command (optional rarity force arg)
		controller.hears(['spawn'],['direct_message','direct_mention','mention'],function(bot,message) {
			api.users.get(message.user, function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					if(response.user.permissions_level >= 3){
						wildPokemon();
					} else {
						return bot.replyPrivate(message, "Only admins can force wild Pokemon spawn!");
					}
				}
			});
		});

		//	Pick a starter
		controller.hears(['(choose|pick|select) starter(s)? (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			var	starter = message.match[3];
			api.pokemon.starter_pick(message.user, starter, function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					var reply = "You've selected  " + utility.pokemon_emoji(response.pokemon, response.instance) + '! Good choice, <@' + message.user + '>!';
					return bot.reply(message, reply);
				}
			});

		});

		//	List all available starters
		controller.hears(['(list|show) starter(s)?'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			api.pokemon.starter_list(function(err, response){
				if(err){
					return bot.reply(message, err);
				} else {
					var starter_list = {};
					response.starters.map(function(o){
						if(!starter_list[o.generation]){
							starter_list[o.generation] = [];
						};
						starter_list[o.generation].push(o);
					});
					var reply = "Available Starters List:\n";
					for (var key in starter_list){
						if(starter_list[key].length > 0){
							reply += utility.numeral_suffix(key) + ' Generation Starters:\n'
							starter_list[key].map(function(o){
								reply += "•\t:" + o.name.toLowerCase() + ": *" + utility.proper_capitalize(o.name) + "* \n";
							});
						}
					}
					return bot.reply(message, reply);
				}
			});
		});

	}
}

module.exports = pokemon;