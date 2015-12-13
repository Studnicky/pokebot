//	Local variables
var Slack = require('slack-client'),
	autoMark = true,
	autoReconnect = true,
	slackToken = process.env.REALTIME_SLACK_TOKEN;

//	Global ref for slack client
slack = new Slack(slackToken, autoReconnect, autoMark);

//	Global ref for slack handler
slackHandler = {
	slack: slack,
	initialize: function(){
		console.log('Slack adapter initialize...');
		this.connect();
		this.dispatch_events();
	},
	connect: function(){
		slack.login();
		slack.on('open', function(){
			return console.log("Connected to " + slack.team.name + " as @" + slack.self.name);
		});
	},
	dispatch_events: function(){
		slack.on('message', function(message) {
			
			//	Dispatch events from here
			console.log("Message event: " + message.type + " heard at " + message.ts);
			console.log("User: " + message.user + " on " + message.team + " in channel " + message.channel);
			console.log(message.text);

		}, function(err){
			console.log('Slack message error: ' + err);
		});
		// Event listener: Error
		slack.on('error', function(err) {
			return console.error("Slack Connection Error: ", err);
		});
	}
};

module.exports = slackHandler;