//	Module imports
var Slack = require('slack-client'),
	request = require('request'),
	db = require(__dirname + '/../db');

//	Slack config vars
var autoMark = true,
	autoReconnect = true,
	slackToken = process.env.REALTIME_SLACK_TOKEN,
	slackEndpoint = 'https://slack.com/api/';

slack = new Slack(slackToken, autoReconnect, autoMark);

//	Global ref for slack handler
slackHandler = {
	Slack: Slack,
	slack: slack,
	initialize: function(){
		console.log('Slack Adapter initialize...');
		slack.login();
		this.events();
		this.web.user.list.get();
	},
	events: function(){

		slack.on('open', function(){
			return console.log("Slack connected to " + slack.team.name + " as @" + slack.self.name + "!");
		});

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
				get: function(callback){
					request.get(slackEndpoint + 'users.list', {
						json: true,
						qs: {token: slackToken}
					}, function(error, response, data) {
						// If we fetched the list, might as well update it
						db.user.list.set(data);

						if(typeof(callback) == 'function'){
							callback(data.members);
						}

					});
				},
				presence: function(callback){
					request.get(slackEndpoint + 'users.list', {
						json: true,
						qs: {token: slackToken, presence: 1}
					}, function(error, response, data) {

						if (data.ok !== true){
							console.log('Failed to retrieve users list from slack API\n' + error);
						} else {
							var active_users = [];

							if(typeof(callback) == 'function'){
								callback(data.members);
							}

						}
					});
				}	
			}
		}
	},
	rtm: {

	}

};

module.exports = slackHandler;