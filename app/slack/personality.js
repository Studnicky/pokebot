var personality = {
	name: 'personality',
	events: function(controller, bot){
		
		var praiseHelix = true;

		controller.on('reaction_added', function(bot, message){
			if(message.reaction == "helix-fossil" && praiseHelix == true){
				bot.reply(message, {"type": "typing"});
				var post = {
					channel: message.item.channel,
					username: ' ',
					icon_emoji: ':helix-fossil:',
					text: "_*Praise be unto him!*_"
				};
				bot.say(post);
				praiseHelix = false;
			}
			setTimeout(function(){ return praiseHelix = true; }, 300000);
		});

	}
}

module.exports = personality;
