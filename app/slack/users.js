var users = {
	name: 'users',
	events: function(bot){

	//	Custom event fire
	bot.hears(['why don\'t you respond to regex'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
		bot.reply(message, 'right here oi');
	});


	}
}

module.exports = users;
