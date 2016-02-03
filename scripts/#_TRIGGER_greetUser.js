//	Description:
//		Greet new users and prompt them to pick a starter Pokémon
//
//	Dependencies:
//		None
//
//	Configuration:
//		None
//
//	Commands:
//		None
//
//	Author:
//		Andrew Studnicky

//	Define required data models
var Models = require('./models'),
	User = Models.User,
	Pokemon_Instance = Models.Pokemon_Instance;

//	Get the utility functions
var Utilities = require('./utility');


module.exports = function greetUser (robot) {

	robot.enter({id: 'user.greet'}, function (res) {

		robot.send('Hello, ' + Utilities.proper_capitalize(res.message.user.name) + '!\nSend me a private message me to get started on your adventure!');


		//	Users may have left channels and rejoined.  Check if user owns a pokemon. Skip script if they do.
		Pokemon_Instance.count({
			where:{
				owner_id: String(res.message.user.id)
			}
		})
		.then(function(count){
			if (!count){
				//	User has no pokemon. They might be new, or have released all their pokemon. Remind them to pick a starter.
				saveUserInfo(res);
				robot.messageRoom(res.message.user.name, "Let's get started, " + Utilities.proper_capitalize(res.message.user.name) + "!\nUse the \`\`\`starter\`\`\` command to pick your first pokemon!");
			}
		})
		.catch(function(error){
			//	...not sure what could go wrong here, honestly.
		});
	});


	function saveUserInfo(res){
	//	Joining a channel means the user is *probably* new.
	//	Retrieve their info from the slack API and upsert them into the users table.

		//	Set options for the API call
		var options = {
			token: process.env.HUBOT_SLACK_TOKEN,
			user: res.message.user.id
		};
		//	Make the API call to get the user's full info
		robot.http("https://slack.com/api/users.info?token=" + options.token + "&user=" + options.user).get()(function(error, response, body) {
			//	Parse reply
			data = JSON.parse(body);

			if(data.ok !== true){
				robot.send("Strange, I couldn\'t find any data on you, " + Utilities.proper_capitalize(res.message.user.name) + ".");
			} else {
				//	Get user data object
				var o = data.user;

				o.permission_level = 0;
				//	Set this user's permissions level
				switch(true){
					case (o.is_primary_owner == 'true'):
						permission_level = 6;
						break;
					case (o.is_owner == 'true'):
						permission_level = 5;
						break;
					case (o.is_bot == 'true'):
						permission_level = 4;
						break;
					case (o.is_admin == 'true'):
						permission_level = 3;
						break;
					case (o.is_restricted == 'true'):
						permission_level = 1;
						break;
					case (o.is_ultra_restricted == 'true'):
						permission_level = 0;
						break;
					default:
						permission_level = 2;
						break;
				}

				//	Upsert this user into postgres
				var this_user = User.upsert({
					slack_id: o.id,
					slack_name: o.name,
					tz_offset: o.tz_offset.toString(),	//	Force this in as a string for now
					permissions_level: o.permission_level,
					credits: 0
				})
				.then(function(){
					console.log("Saved user " + o.id + " as " + o.name);
				})
				.catch(function(error){
					console.log("Failed to save user " + o.id + " as " + o.name + "\n" + error);
				});

			}

		});
	}

};