//	Local variables
var Slack = require('slack-client'),
Sequelize = require('sequelize'),
request = require('request'),
autoMark = true,
autoReconnect = true,
slackToken = process.env.REALTIME_SLACK_TOKEN;

//	Define requires data models
var Models = require(__dirname + '/../sequelize'),
User = Models.User,
Pokemon = Models.Pokemon;

//	Global ref for slack handler
slackHandler = {
	initialize: function(){
		slack = new Slack(slackToken, autoReconnect, autoMark);
		console.log('Slack adapter initialize...');
		this.connect();
		this.dispatch_events();
		this.web.user.list.get();
		this.web.user.list.presence();
		this.seed_pokemon();
		this.echo_starters();
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
					request.get('https://slack.com/api/users.list', {
						json: true,
						qs: {token: slackToken}
					}, function(error, response, data) {
						// Should have error handling for fail to connect...
						data.members.map(function(o){

							var permission_level = 0;
							//	Permissions level
							switch(true){
								case (o.is_primary_owner == true):
								permission_level = 6;
								break;
								case (o.is_owner == true):
								permission_level = 5;
								break;
								case (o.is_bot == true):
								permission_level = 4;
								break;
								case (o.is_admin == true):
								permission_level = 3;
								break;
								case (o.is_restricted == true):
								permission_level = 1;
								break;
								case (o.is_ultra_restricted == true):
								permission_level = 0;
								break;
								default:
								permission_level = 2;
								break;
							}

							//	Instantiate a new user
							User.upsert({
								slack_id: o.id,
								slack_name: o.name,
								tz_offset: o.tz_offset,	//	Force this in as a string for now
								permissions_level: permission_level,
								position_cap: 15 * permission_level,
								credits: 0
							})
							.then(function(){
								console.log("Saved user " + o.id + " as " + o.name);
							})
							.catch(function(error){
								console.log("Failed to save user " + o.id + " as " + o.name + "\n" + error);
							});

						});
						
						//	return callback(data.members);

					})
				},
				presence: function(){
					request.get('https://slack.com/api/users.list', {
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
					})
				}	
			}
		}
	},
	rtm: {

	},
	//	These only exist to prove sequelize is working and will go away when db import is done
	seed_pokemon: function(){
		var pokemon_list = require(__dirname + '/../../seed.json');

		// Bulk create is undocumented, iterating array for now
		pokemon_list.forEach(function(this_pokemon){
			Pokemon.upsert(this_pokemon)
			.then(function(){
				// console.log("Stored: " + this_pokemon.name);
			})
			.catch(function(error){
				console.log("Failed to store: " + this_pokemon.name + "\n" + error);
			});
		});

	},
	echo_starters: function(){

		Pokemon.findAll({
			attributes: ['name'],
			order: [['gen', 'ASC'],['name', 'ASC']],
			where:{
				is_starter: true,
			}
		}).then(function(starters){
			
			var replyMessage = "All starter pokemon available are: \n";
			starters.map(function(pokemon){
				replyMessage += "•\t:" + pokemon.name.toLowerCase() + ": " + pokemon.name + " \n";
			});
			console.log(replyMessage);
			return;
		});

	}

};

module.exports = slackHandler;