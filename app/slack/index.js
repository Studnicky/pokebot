module.exports = function SlackHandler(){

	//	Slack config
	var Slack = require('slack-client');
	var autoMark = true;
	var autoReconnect = true;
	var slackToken = process.env.REALTIME_SLACK_TOKEN;

	var slack = new Slack(slackToken, autoReconnect, autoMark);

	//	Event: Connection Opened
	slack.on('open', function(){
		return console.log("Connected to " + slack.team.name + " as @" + slack.self.name);
	});

	// Event: Message recieved in any room or DM the bot is present
	slack.on('message', function(message) {

		if(!message.text) return false;

		var data = message.text;
		console.log(data);

	}, function(err){
		console.log('Slack message error: ' + err);
	});

	// Event: Error
	slack.on('error', function(err) {
		return console.error("Slack Connection Error: ", err);
	});

	slack.login();

};