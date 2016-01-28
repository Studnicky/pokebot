var default_connection = {
	name: 'default_connection',
	events: function(controller, bot){

		controller.on('rtm_open', function(bot){
			console.log('** Slack connection opened!');
		});

		controller.on('rtm_close', function(bot, data){
			console.log('** ' + bot.identity.id + ' lost connection to slack.');
		});

		controller.on('reconnect_url',function(bot, data){
			console.log('** Slack reconnect URL was issued.');
		});

	}
}

module.exports = default_connection;
