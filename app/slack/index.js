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

		// bot.say({text: '<@' + bot.identity.id + '>' + " running on " + os.hostname(), channel: "C09EUKXHT"});	//	Get channel ID?
		//	Fetch and store user list on initialization
		bot.api.users.list({token: token},function(err,response) {
			if(!err){
				db.user.list.set(response);
			} else {
				console.log('Unable to retrieve user list');
			}
		});
	} else {
		throw new Error('Could not connect bot to slack')
	}
});

module.exports = slack;