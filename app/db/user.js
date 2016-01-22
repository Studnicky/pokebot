//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	User = Models.User,
	Pokemon = Models.Pokemon,
	Pokemon_Instance = Models.Pokemon_Instance;

var user = {
	name: 'user',
	methods: {

		find_open_position: function(userid, callback){
			User.findOne({
				where: { slack_id: userid },
				attributes: ['position_cap'],
				include: [{
					model: Pokemon_Instance,
					attributes: ['party_position'],
					order: [['party_position', 'ASC']]
				}]
			}).then(function(this_user){

				var open_positions = [], count = 1;
				while(count <= this_user.position_cap){
					open_positions.push(count++);
				};

				this_user.Pokemon_Instances.map(function(o){
					if(open_positions.indexOf(o.party_position) != -1){
						open_positions.splice(open_positions.indexOf(o.party_position), 1);
					}
				});

				if(typeof(callback) == 'function'){
					callback(open_positions);
				}
			});
		},

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

			set: function(data){

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