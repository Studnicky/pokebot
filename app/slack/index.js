var BotKit = require('botkit');
var path = require('path');
var fs = require('fs');
var os = require('os');

var api = require(__dirname +'/../api');
var utility = require(__dirname +'/../utility');

var token = process.env.REALTIME_SLACK_TOKEN;
var controller = BotKit.slackbot({debug: false, log: true});						//	Construct botkit controller
var slack = controller.spawn({token: token}).startRTM(function(err,bot,payload) {	//	Instantiate bot
	if (!err) {
		//	Read and initialize slack modules
		fs.readdirSync(__dirname).filter(function(file){
			return (file.indexOf(".") !== 0) && (file !== "index.js");
		}).map(function(file){
			var handler = require(path.join(__dirname, file));
			controller[handler.name] = handler.events;
			controller[handler.name](controller, bot);
		});

		//	Payload includes user list, send to api to store
		if(payload.users){ api.user.list.set(payload.users); }
		
		//	Payload includes channels, set into memory cache
		if(payload.channels){
			payload.channels.map(function(channel){
				bot[channel.name] = channel.id;
			});
		}

		bot.say({text: 'Online! <@' + bot.identity.id + '>' + " running on " + os.hostname(), channel: bot.general});
	} else {
		throw new Error('Could not connect bot to slack')
	}
});

module.exports = slack;