var BotKit = require('botkit');
var path = require('path');
var fs = require('fs');

var db = require(__dirname +'/../db');

//	Instantiate bot, spawn controller
var token = process.env.REALTIME_SLACK_TOKEN;
var bot = BotKit.slackbot({debug: false, log: true});
var slack = bot.spawn({token: token});

//	Read and initialize slack modules
fs.readdirSync(__dirname).filter(function(file){
	return (file.indexOf(".") !== 0) && (file !== "index.js");
}).map(function(file){
	var handler = require(path.join(__dirname, file));
	bot[handler.name] = handler.events;
	bot[handler.name](bot);
});

slack.startRTM(function(err,bot,payload) {
	if (err) {throw new Error('Could not connect bot to slack')}
});

//	Fetch and store user list on initialization
slack.api.users.list({token: token},function(err,response) {
	if(!err){
		db.user.list.set(response);
	}
});

module.exports = slack;