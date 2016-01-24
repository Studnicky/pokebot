var token = process.env.REALTIME_SLACK_TOKEN;

var personality = {
	name: 'personality',
	events: function(controller, bot){
		
		var timer = true;

		controller.on('reaction_added', function(bot, message){
			if(message.reaction.split('-')[0] == "helix" && timer == true){
				var post = {
					token: token,
					channel: message.item.channel,
					username: ' ',
					icon_emoji: ':helix-fossil:',
					text: "_*Praise be unto him!*_"
				};
				bot.say(post);
			}
			timer = false;
			setTimeout(function(){ return timer = true; }, 300000);
		});

	}
}

module.exports = personality;
