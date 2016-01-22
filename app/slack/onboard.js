var onboard = {
	name: 'onboard',
	events: function(bot){

		bot.on('team_join', function(bot, data){
			console.log('A new team member has joined');
			console.log(data);
		});
		
		bot.on('channel_join',function(bot, data){
			console.log('A team member joined a channel')
			console.log(data);
		});

	}
}

module.exports = onboard;
