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

//	Refer here for making hubot identify present users

	//	https://api.slack.com/methods/users.list/test
	//	https://slack.com/api/users.list?token={API TOKEN}&presence=1&pretty=1

	//	https://api.slack.com/methods/users.getPresence/test
	//	https://slack.com/api/users.getPresence?token={API TOKEN}&user={USER ID}&pretty=1

//	Refer here for identifying user info

	//	https://api.slack.com/methods/users.info/test
	// 	https://slack.com/api/users.info?token={API TOKEN}&user={USER ID}}&pretty=1

//	Define required modules
var Sequelize = require('sequelize');

//	Define requires data models
var Models = require('./models'),
	User = Models.User;

module.exports = function getUserInfo (robot) {

	robot.respond(/user\s*info?$/i, function (res) {

		if (res.message.room != res.message.user.name) {
			res.reply("Please private message me!");
			return;
		} else {

		//	TODO::

		var options = {
		  token: process.env.HUBOT_SLACK_TOKEN,
		  user: ''
		};

		//	Get info and active presence of all users
		robot.http("https://slack.com/api/users.list?token=" + options.token + "&presence=1").get()(function(err, res, body){
			console.log(body);
		});

		//	Get active presence of a specific user by id
		robot.http("https://slack.com/api/users.getPresence?token=" + options.token + "&user=" + options.user).get()(function(err, res, body) {
			console.log(body);
		});


		//	Get full user profile and slack permissions
		robot.http("https://slack.com/api/users.info?token=" + options.token + "&user=" + options.user).get()(function(err, res, body) {
			console.log(body);
		});

	}
});
};
