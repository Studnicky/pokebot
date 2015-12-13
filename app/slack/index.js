//	Local variables
var Slack = require('slack-client'),
	autoMark = true,
	autoReconnect = true,
	slackToken = process.env.REALTIME_SLACK_TOKEN;

SlackHandler = function(){

	var slack = new Slack(slackToken, autoReconnect, autoMark);

	//	Event listener: connection started
	slack.on('open', function(){
		return console.log("Connected to " + slack.team.name + " as @" + slack.self.name);
	});

	// Event listener: Message recieved
	slack.on('message', function(message) {
		console.log(message);
		
		//	Important information
		// console.log(message.type);
		// console.log(message.channel);
		// console.log(message.ts);
		// console.log(message.user);
		// console.log(message.text);

	}, function(err){
		console.log('Slack message error: ' + err);
	});

	// Event listener: Error
	slack.on('error', function(err) {
		return console.error("Slack Connection Error: ", err);
	});

	slack.login();

};

module.exports = SlackHandler;

