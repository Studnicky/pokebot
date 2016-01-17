//	Module imports
var Slack = require('slack-client'),
	request = require('request'),
	db = require(__dirname + '/../db');

//	Config vars
	var autoMark = true,
		autoReconnect = true,
		slackToken = process.env.REALTIME_SLACK_TOKEN,
		slackEndpoint = 'https://slack.com/api/';

//	Global ref for slack handler
slackHandler = {
	initialize: function(){
		slack = new Slack(slackToken, autoReconnect, autoMark);
		console.log('Slack adapter initialize...');
		this.connect();
		this.dispatch_events();
		this.web.user.list.get();
		this.web.user.list.presence();
	},
	connect: function(){
		slack.login();
		slack.on('open', function(){
			return console.log("Slack connected to " + slack.team.name + " as @" + slack.self.name + "!");
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
	},
	web: {
		user: {
			list: {
				get: function(){
					request.get(slackEndpoint + 'users.list', {
						json: true,
						qs: {token: slackToken}
					}, function(error, response, data) {
						// Should have error handling for fail to connect...
						db.user.list.set(data);
					});
				},
				presence: function(){
					request.get(slackEndpoint + 'users.list', {
						json: true,
						qs: {token: slackToken, presence: 1}
					}, function(error, response, data) {

						if (data.ok !== true){
							console.log('Failed to retrieve users list from slack API\n' + error);
						} else {
							var active_users = [];
							var replyMessage = "The following users are currently active:\n";

							//	Find present users
							data.members.map(function(o){
								if (o.presence == 'active'){
									active_users.push({slack_id: o.id, slack_name: o.name});
									replyMessage += "•\t" + o.name + " \n";
								}
							});
							//	Are you forever alone?
							if (active_users.length > 1){
								console.log(replyMessage);
							} else {
								console.log("You are currently the only active user.\nhttp://i.imgur.com/i4Gyi2O.png");
							}
						}

						// return callback(active_users);
					});
				}	
			}
		}
	},
	rtm: {

	}

};

module.exports = slackHandler;