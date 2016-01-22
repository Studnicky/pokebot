var user = {
	name: 'user',
	events: function(bot){

		//	Custom event fire
		bot.hears(['(hello|what\'s up|hi there)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			bot.reply(message, 'Hey there');
		});

	}
}

module.exports = user;
