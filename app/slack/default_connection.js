var default_connection = {
	name: 'default_connection',
	events: function(bot){

		bot.on('rtm_open', function(bot){
			console.log('Slack connection opened!');
		});

		bot.on('rtm_close', function(bot, data){
			console.log('Slack connection lost!');
			console.log(data);
		});

	}
}

module.exports = default_connection;
