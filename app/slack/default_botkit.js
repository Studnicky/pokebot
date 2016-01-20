var default_botkit = {
	name: 'default_botkit',
	events: function(bot){

		bot.on('message_received', function(bot, data){
			console.log('A message was received by the bot');
			console.log(data);
		});

		bot.on('bot_channel_join', function(bot, data){
			console.log('The bot has joined a channel');
			console.log(data);
		});

		bot.on('user_channel_join', function(bot, data){
			console.log('A user has joined a channel');
			console.log(data);
		});

		bot.on('bot_group_join', function(bot, data){
			console.log('The bot has joined a group');
			console.log(data);
		});

		bot.on('user_group_join', function(bot, data){
			console.log('A user has joined a group');
			console.log(data);
		});

		bot.on('direct_message', function(bot, data){
			console.log('The bot received a direct message from a user');
			console.log(data);
		});

		bot.on('direct_mention', function(bot, data){
			console.log('The bot was addressed directly in a channel');
			console.log(data);
		});

		bot.on('mention', function(bot, data){
			console.log('The bot was mentioned by someone in a message');
			console.log(data);
		});

		bot.on('ambient', function(bot, data){
			console.log('The message received had no mention of the bot');
			console.log(data);
		});

	}
}

module.exports = default_botkit;
