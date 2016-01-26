var token = process.env.REALTIME_SLACK_TOKEN;

var users = {
	name: 'users',
	events: function(controller, bot){

		getUserRole = function(users){
			var user_list = {Admins: [], Users: [], Guests: [], Bots: []};
			users.map(function(o){
				switch(true){
					case (o.is_primary_owner == true):
						user_list.Admins.push(o);
						break;
					case (o.is_owner == true):
						user_list.Admins.push(o);
						break;
					case (o.is_bot == true):
						user_list.Bots.push(o);
						break;
					case (o.is_admin == true):
						user_list.Admins.push(o);
						break;
					case (o.is_restricted == true):
						user_list.Guests.push(o);
						break;
					case (o.is_ultra_restricted == true):
						user_list.Guests.push(o);
						break;
					default:
						user_list.Users.push(o);
						break;
				}
			});
			return user_list;
		}

		//	Find all users
		controller.hears(['users (get|all|list)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			bot.startTyping;
			bot.api.users.list({token: token},function(err,data) {
				if(err){
					return bot.reply(message, err);
				} else {
					user_list = getUserRole(data.members);
					var replyMessage = "Full user list:\n";
					for (var key in user_list){
						if(user_list[key].length > 0){
							replyMessage += key + ':\n'
							user_list[key].map(function(o){
								replyMessage += "•\t" + o.name + " \n";
							});
						}
					}
					api.user.list.set(data.members);
					return bot.reply(message, replyMessage);
				}
			});
		});

		//	List present users
		controller.hears(['users (here|present|active|awake)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			bot.startTyping;
			bot.api.users.list({token: token, presence: 1},function(err,data) {
				if(err){
					return bot.reply(message, err);
				} else {
					var active_users = data.members.filter(function(user){
						return (user.presence != "away") && (user.presence != "undefined");
					});
					if (active_users.length > 1){
						var replyMessage = "The following users are currently active:\n";		
						active_users = getUserRole(active_users);
						for (var key in active_users){
							if(active_users[key].length > 0){
								replyMessage += key + ':\n'
								active_users[key].map(function(o){
									replyMessage += "•\t" + o.name + " \n";
								});
							}
						}
					} else {
						replymessage = "You are currently the only active user.\nhttp://i.imgur.com/i4Gyi2O.png";
					}
					api.user.list.set(data.members);
					return bot.reply(message, replyMessage);
				}
			});
		});
	}
}

module.exports = users;