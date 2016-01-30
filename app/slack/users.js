var api = require(__dirname +'/../api');

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
		controller.hears(['(list|show) users'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			bot.reply(message, {"type": "typing"});
			bot.api.users.list({token: bot.token},function(err,response) {
				if(err){
					return bot.reply(message, err);
				} else {
					user_list = getUserRole(response.members);
					var reply = "Full user list:\n";
					for (var key in user_list){
						if(user_list[key].length > 0){
							reply += key + ':\n'
							user_list[key].map(function(o){
								reply += "•\t" + o.name + " \n";
							});
						}
					}
					api.users.list.set(response.members);
					return bot.reply(message, reply);
				}
			});
		});

		//	List present users
		controller.hears(['(find|get) users (active|awake|here|online|present)'],['direct_message','direct_mention','mention', 'ambient'],function(bot,message) {
			bot.reply(message, {"type": "typing"});
			bot.api.users.list({token: bot.token, presence: 1},function(err,response) {
				if(err){
					return bot.reply(message, err);
				} else {
					var active_users = response.members.filter(function(user){
						return (user.presence != "away") && (user.presence != "undefined") && (user.is_bot == "false");
					});
					if (active_users.length > 1){
						var reply = "The following users are currently active:\n";		
						active_users = getUserRole(active_users);
						for (var key in active_users){
							if(active_users[key].length > 0){
								reply += key + ':\n'
								active_users[key].map(function(o){
									reply += "•\t" + o.name + " \n";
								});
							}
						}
					} else {
						reply = "You are currently the only active user.\nhttp://i.imgur.com/i4Gyi2O.png";
					}
					api.users.list.set(response.members);
					return bot.reply(message, reply);
				}
			});
		});
	}
}

module.exports = users;