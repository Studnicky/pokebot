var default_connection = {
	name: 'default_connection',
	events: function(controller, bot){

		// controller.on('rtm_open', function(bot){
		// 	console.log('Slack connection opened!');
		// });

		// controller.on('rtm_close', function(bot, data){
		// 	console.log('Slack connection lost!');
		// });

		// controller.on('reconnect_url',function(bot, data){
		// 	console.log('A reconnect URL was issued.')
		// 	console.log(data);
		// });

	}
}

module.exports = default_connection;
