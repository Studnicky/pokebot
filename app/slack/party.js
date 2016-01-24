var db = require(__dirname +'/../db');
var utility = require(__dirname +'/../utility');

var party = {
	name: 'party',
	events: function(controller, bot){

		//	Get user party
		controller.hears(['party (get|list|members|roster)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			db.party.get(message.user, function(party){
				var response = '';

				if(party.length > 0){
					response += "Your current party members are: \n";
					party.map(function(instance){
						response += utility.numeral_suffix(instance.party_position) + ': ' + utility.pokemon_emoji(instance.Pokemon, instance)+ "\n";
					});
				} else {
					response = "You don't have any pokemon in your party!";
				}
				bot.reply(message, response);
			});
		});

		//	Get user storage box
		controller.hears(['(box|pc|storage) (list|get) (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			var box = typeof(parseInt(message.match[3])) == 'number' ? parseInt(message.match[3]) : 1;
			db.party.box_get(message.user, box, function(party){

				var response = '';

				if(party.length > 0){
					response += "Pokemon in " + utility.numeral_suffix(box) + " box are: \n";
					party.map(function(instance){
						var numeral = utility.numeral_suffix(instance.party_position-(box-1)*30-6);
						response += numeral + ': ' + utility.pokemon_emoji(instance.Pokemon, instance)+ "\n";
					});
				} else {
					res.send("You don't have any pokemon in your party!");
				}
				bot.reply(message, response);
			});
		});

		//	Get user party
		controller.hears(['(swap|switch) ((party)|((box|pc|storage) ([1-6]))) ([1-3]?[0-9]) ((party)|((box|pc|storage) ([1-6]))) ([1-3]?[0-9])'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			if(message.match[7] == 0 || message.match[13] == 0){
				return bot.reply(message, "Position cannot be zero!");
			}

			var box_1 = (typeof(message.match[6]) == 'undefined') ? undefined : parseInt(message.match[6]);
			var box_2 = (typeof(message.match[12]) == 'undefined') ? undefined : parseInt(message.match[12]);
			var position_1 = (box_1)*30-30+6+parseInt(message.match[7]) || parseInt(message.match[7]);
			var position_2 = (box_2)*30-30+6+parseInt(message.match[13]) || parseInt(message.match[13]);
			
			//	If either position is empty, DB will be mad when we attempt to transact
			db.party.swap(message.user, position_1, position_2, function(response){
				bot.reply(message, response);
			});

		});

		//	Get user party
		controller.hears(['party (member|number) (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {

			var matchreply = '';
			message.match.map(function(e,i,a){
				matchreply += "Message match: " + i + " = " + e + "\n";
			}.bind(message));
			bot.reply(message, matchreply);

			console.log(message);

		});


				//	Get user party
		controller.hears(['party (release|delete) (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {

			var matchreply = '';
			message.match.map(function(e,i,a){
				matchreply += "Message match: " + i + " = " + e + "\n";
			}.bind(message));
			bot.reply(message, matchreply);

			console.log(message);

		});


	}
}

module.exports = party;
