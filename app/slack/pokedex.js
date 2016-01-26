var api = require(__dirname +'/../api');

var pokedex = {
	name: 'pokedex',
	events: function(controller, bot){
		
		//	Get user party
		controller.hears(['pokedex (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			bot.reply(message, {"type": "typing"});

			console.log(message);

			message.match.map(function(e,i,a){
				bot.reply(message, "Message match: " + i + " = " + e);
			}.bind(message));

		});
	}
}

module.exports = pokedex;
