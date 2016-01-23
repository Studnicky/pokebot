var BotKit = require('botkit');
var path = require('path');
var fs = require('fs');
var os = require('os');

var db = require(__dirname +'/../db');
var utility = require(__dirname +'/../utility');


var token = process.env.REALTIME_SLACK_TOKEN;

//	Instantiate bot, spawn controller
var controller = BotKit.slackbot({debug: false, log: true});
var slack = controller.spawn({token: token}).startRTM(function(err,bot,payload) {
	if (!err) {
		//	Read and initialize slack modules
		fs.readdirSync(__dirname).filter(function(file){
			return (file.indexOf(".") !== 0) && (file !== "index.js");
		}).map(function(file){
			var handler = require(path.join(__dirname, file));
			controller[handler.name] = handler.events;
			controller[handler.name](controller, bot);
		});

		bot.say({text: 'Online! <@' + bot.identity.id + '>' + " running on " + os.hostname(), channel: "C09EUKXHT"});	//	Get channel ID?

		for (var key in payload){
			console.log('Payload contains: ' + key);
		}

		//	Payload includes user list, store it in db
		db.user.list.set(payload.users);

	} else {
		throw new Error('Could not connect bot to slack')
	}
});

module.exports = slack;