//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	User = Models.User,
	Pokemon = Models.Pokemon,
	Pokemon_Instance = Models.Pokemon_Instance;

var user = {
	name: 'user',
	methods: {

		get_name_by_userid: function(userid, callback){
			User.findOne({
				where: { slack_id: userid },
				attributes: ['slack_name']
			}).then(function(this_user){
				if(typeof(callback) == 'function'){
					callback(this_user.slack_name);
				}
			});
		},

		get_userid_by_name: function(username, callback){
			User.findOne({
				where: { slack_name: username },
				attributes: ['slack_id']
			}).then(function(this_user){
				if(this_user && typeof(callback) == 'function'){
					callback(this_user.slack_id);
				}
			});
		},

		get_info: function(userid, callback){
			User.findOne({
				where: { slack_id: userid }
			}).then(function(this_user){
				if(this_user && typeof(callback) == 'function'){
					callback(this_user);
				}
			});
		},


		list: {

			get: function(callback){
				var users = null;

				User.findAll({
				}).then(function(users){
					if(users && typeof(callback) == 'function'){
						callback(users);
					}
				}).catch(function(error){
					console.log(error);
				});

			},

			set: function(users){

				users.map(function(o){
					switch(true){
						case (o.is_primary_owner == true):
						o.permissions_level = 6;
						break;
						case (o.is_owner == true):
						o.permissions_level = 5;
						break;
						case (o.is_bot == true):
						o.permissions_level = 4;
						break;
						case (o.is_admin == true):
						o.permissions_level = 3;
						break;
						case (o.is_restricted == true):
						o.permissions_level = 1;
						break;
						case (o.is_ultra_restricted == true):
						o.permissions_level = 0;
						break;
						default:
						o.permissions_level = 2;
						break;
					}

					//	Instantiate a new user
					User.upsert({
						slack_id: o.id,
						slack_name: o.name,
						tz_offset: o.tz_offset,	//	Force this in as a string for now
						permissions_level: o.permissions_level,
						position_cap: 15 * o.permissions_level,
						credits: 0
					})
					.then(function(){
						// console.log("Saved:\t" + o.id + " as " + o.name);
					})
					.catch(function(error){
						// console.log("Failed to save user " + o.id + " as " + o.name + "\n" + error);
					});
				});
			}
		}

	}
}

module.exports = user;