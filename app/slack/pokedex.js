var db = require(__dirname +'/../db');

var pokedex = {
	name: 'pokedex',
	events: function(bot){
		
		//	Get user party
		bot.hears(['pokedex (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {

			console.log(message);

			message.match.map(function(e,i,a){
				bot.reply(message, "Message match: " + i + " = " + e);
			}.bind(message));

		});
	}
}

module.exports = pokedex;
