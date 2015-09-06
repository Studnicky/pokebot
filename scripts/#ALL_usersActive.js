//	Description:
//		Test a user
//
//	Dependencies:
//		Sequelize
//
//	Configuration:
//		None
//
//	Commands:
//		None
//
//	Author:
//		Andrew Studnicky

//	Define required modules
var Sequelize = require('sequelize');

//	Define requires data models
var Models = require('./models'),
	User = Models.User;

//	Get the utility functions
var Utilities = require('./utility');

var options = {
	token: process.env.HUBOT_SLACK_TOKEN
};

module.exports = function usersActive (robot) {

	robot.respond(/users?\s*(here|present|active|awake)\s*(.*)$/i, {id: 'users.active'}, function (res) {

		//	Find out what they asked us
		var userQuery = res.match[2].replace(/@/, "").trim() || "";
		var result = "";

		if(typeof(userQuery) == "undefined" || userQuery.length === 0){
			result = getAllPresent(res);
		} else {
			result = getUserPresence(res, userQuery);
		}

	});

	function getAllPresent(res){
		//	Get full user profiles with presence info option
		robot.http("https://slack.com/api/users.list?token=" + options.token + "&presence=1").get()(function(error, reponse, body){
			data = JSON.parse(body);

			if (data.ok !== true){
				console.log('Failed to retrieve users list from slack API\n' + error);
			} else {

				var active_users = [];
				var replyMessage = "The following users are currently active:\n";

				//	Find present users
				data.members.map(function(o){
					if (o.presence == 'active' && o.is_bot == 'false'){
						active_users.push({id: o.id, name: o.name});
						replyMessage += "•\t" + o.name + " \n";
					}
				});
				//	Are you forever alone?
				if (active_users.length > 1){
					res.send(replyMessage);
				} else {
					res.reply("You are currently the only active user.\nhttp://i.imgur.com/i4Gyi2O.png");
				}
			}
		});
	}


	function getUserPresence(res, userQuery){

		//	Get user ID from database by their name
		User.findOne({
			attributes:['slack_name', 'slack_id'],
			where:{
				slack_name: {$iLike: '%' + userQuery + '%'}
			}
		}).then(function(user){
			//	Did we get something?
			if(user){
				//	Set the user's slack_id as the user option for the API call
				options.user = user.slack_id;
				//	Make the API call to get the user's current presence
				robot.http("https://slack.com/api/users.getPresence?token=" + options.token + "&user=" + options.user).get()(function(error, response, body) {
					//	Parse reply
					data = JSON.parse(body);
					if(data.ok !== true){
						res.reply("Sorry, I wasn\'t able to find information on that user.\n");
					} else {
						res.send(Utilities.proper_capitalize(user.slack_name) + " is currently " + data.presence + ".");
					}
				});
			} else {	//	We got nothing.
				res.send("Sorry, I don\'t know a user named " + userQuery);
			}
		});
	}
};