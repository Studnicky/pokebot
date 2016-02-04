var onboard = {
	name: 'onboard',
	events: function(controller, bot){

		controller.on('team_join', function(bot, data){
			console.log('A new team member has joined');
			bot.startPrivateConversation({user: message.user.id}, function(err,dm) {
			    dm.say('Hello!');
			});
		});
		
		controller.on('channel_join',function(bot, data){
			console.log('A team member joined a channel')
			console.log(data);
		});

	}
}

module.exports = onboard;