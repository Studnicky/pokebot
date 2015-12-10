module.exports = function SlackHandler(){

	//	Slack config
	var Slack = require('slack-client');
	var autoMark = true;
	var autoReconnect = true;
	var slackToken = process.env.REALTIME_SLACK_TOKEN;

	var slack = new Slack(slackToken, autoReconnect, autoMark);

	//	Event listener: connection started
	slack.on('open', function(){
		return console.log("Connected to " + slack.team.name + " as @" + slack.self.name);
	});

	// Event listener: Message recieved
	slack.on('message', function(message) {

		if(!message.text) return false;

		var data = message.text;
		console.log(data);

	}, function(err){
		console.log('Slack message error: ' + err);
	});

	// Event listener: Error
	slack.on('error', function(err) {
		return console.error("Slack Connection Error: ", err);
	});

	slack.login();

};

