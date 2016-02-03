//	Description:
//		Tell oak to DM you
//
//	Dependencies:
//		None
//
//	Configuration:
//		None
//
//	Commands:
//		hubot dm me           - tell Oak to DM you
//
//	Author:
//		Andrew Studnicky

module.exports = function dmMe (robot) {

	//	Get the utility functions
	var Utilities = require('./utility');

	robot.respond(/DM\s*me$/i, {id: 'dmMe'}, function (res) {

		//	Demo of sending DM to a user from a response.
		//	Send to the user channel (A room with channel of user's name is considered DM)
		robot.messageRoom(res.message.user.name, "Sup, " + Utilities.proper_capitalize(res.message.user.name) + "?");

		//	Build the channel invite
		//	https://pokebot.slack.com/api/channels.invite?token={MY_TOKEN}&channel={username}&user={myid}

	});

};