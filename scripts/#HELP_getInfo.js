//	Description:
//	Return information about selected topics
//
//	Dependencies:
//	None
//
//	Configuration:
//	None
//
//	Commands:
//	hubot info            - Show a list of available info topics
//
//	Author:
//	Andrew Studnicky

module.exports = function getInfo (robot) {

	//	Get the utility functions
	var Utilities = require('./utility');
	
	robot.respond(/info(.*)$/i, {id: 'help.info'}, function (res) {	
		//	Check the room first, only answer DM or help channel
		if (res.message.room != "help" || res.message.room != res.message.user.name){
			robot.messageRoom(res.message.user.name, "I can only answer help questions in the help channel or via private message, @" + Utilities.proper_capitalize(res.message.user.name) + ".");
			return;
		} else {

			var infoQuery = res.match[1].trim() || "";
			var replyMessage = '';

			switch (infoQuery) {
				case "me":
					replyMessage = 'Your userID is ' + res.message.user.id + ', and you just asked about *' + infoQuery + '* in the ' + res.message.room + ' channel.';
					break;
				default:
				var topics = ["me"];

				replyMessage = "I can certainly help! Just tell me what you need info on.\n";
				topics.forEach(function(element){
					replyMessage += "•\t" + element + "\n";
				});
			}
			res.send(replyMessage);
		}
	});
};