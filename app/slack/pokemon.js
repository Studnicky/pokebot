var db = require(__dirname +'/../db');
var utility = require(__dirname +'/../utility');

var pokemon = {
	name: 'pokemon',
	events: function(bot){

		//	Get user party
		bot.hears(['spawn (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			bot.reply(message, {"type": "typing"});
			var rarity = parseInt(message.match[1]);
			var rarity = (typeof(rarity) == 'number' && rarity >= 0 && rarity <= 255) ? rarity : 0;
			db.pokemon.spawn(rarity, function(pokemon_instance){
				bot.reply(message, "Wild :" + pokemon_instance.name.toLowerCase() + ": " + pokemon_instance.name + " appeared!");
			});
		});

		//	Get user party
		bot.hears(['starter pick (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			bot.startTyping;

			db.party.count(function(count){
				if(count > 0){
					bot.reply(message, "You already have a Pokemon!")
				} else {
					
				}
			});

			console.log(message);

			message.match.map(function(e,i,a){
				bot.reply(message, "Message match: " + i + " = " + e);
			}.bind(message));

		});

		//	Get user party
		bot.hears(['starter(s)? (get|list)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
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
		bot.hears(['pokemon (release|delete) (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {

			console.log(message);

			message.match.map(function(e,i,a){
				bot.reply(message, "Message match: " + i + " = " + e);
			}.bind(message));

		});


		//	Get user party
		bot.hears(['pokemon (get|info) (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {

			console.log(message);

			message.match.map(function(e,i,a){
				bot.reply(message, "Message match: " + i + " = " + e);
			}.bind(message));

		});

	}
}

module.exports = pokemon;
