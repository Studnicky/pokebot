var db = require(__dirname +'/../db');

var party = {
	name: 'party',
	events: function(bot){

		//	Get user party
		bot.hears(['party (get|list|members|roster) (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {

			console.log(message);

			message.match.map(function(e,i,a){
				bot.reply(message, "Message match: " + i + " = " + e);
			}.bind(message));

		});
		
		//	Get user party
		bot.hears(['party (swap|switch) (.*) (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {

			console.log(message);

			message.match.map(function(e,i,a){
				bot.reply(message, "Message match: " + i + " = " + e);
			}.bind(message));

		});

		//	Get user party
		bot.hears(['party (member|number) (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {

			console.log(message);

			message.match.map(function(e,i,a){
				bot.reply(message, "Message match: " + i + " = " + e);
			}.bind(message));

		});

		//	Get user storage box
		bot.hears(['(box|pc|storage) (list|get) (.*) (.*)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {

			console.log(message);

			message.match.map(function(e,i,a){
				bot.reply(message, "Message match: " + i + " = " + e);
			}.bind(message));

		});

	}
}

module.exports = party;
