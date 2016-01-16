

// var Users = function(app, socket){
// 	this.app = app;
// 	this.socket = socket;

// 	this.handler = {
// 		getPresence: getPresence.bind(this)
// 	}
// };

// function getPresence() {
// 	request.get('https://slack.com/api/users.list', {
// 		json: true,
// 		qs: {token: slackToken, presence: 1}
// 	}, function(error, response, data) {

// 		if (data.ok !== true){
// 			console.log('Failed to retrieve users list from slack API\n' + error);
// 		} else {

// 			var active_users = [];
// 			var replyMessage = "The following users are currently active:\n";

// 				//	Find present users
// 				data.members.map(function(o){
// 					if (o.presence == 'active'){
// 						active_users.push({slack_id: o.id, slack_name: o.name});
// 						replyMessage += "•\t" + o.name + " \n";
// 					}
// 				});
// 				//	Are you forever alone?
// 				if (active_users.length > 1){
// 					console.log(replyMessage);
// 				} else {
// 					console.log("You are currently the only active user.\nhttp://i.imgur.com/i4Gyi2O.png");
// 				}
// 			}

// 			socket.emit('return-user-presence', {outgoing: active_users});

// 		})
// };

// module.exports = Users;