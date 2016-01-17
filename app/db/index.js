//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	User = Models.User,
	Pokemon = Models.Pokemon;

dbHandler = {
	initialize: function(){
		console.log('Sequelize initialize...');
		setTimeout(this.seed_pokemon(),10000);	//	Temporary
	},

	seed_pokemon: function(){	//	Temporary method
		console.log('Seeding database...');
		var pokemon_list = require(__dirname + '/../../seed.json');

		// Bulk create is undocumented, iterating array for now
		pokemon_list.forEach(function(this_pokemon){
			Pokemon.upsert(this_pokemon)
			.then(function(){
				console.log("Stored:\t" + this_pokemon.name);
			})
			.catch(function(error){
				console.log("Failed to store: " + this_pokemon.name + "\n" + error);
			});
		});

	},

	user: {
		find_open_position: function(userid){
			var position = null;

			return position;
		},
		get_name_by_id: function(userid){
			var username = null;

			return username;
		},
		get_userid_by_name: function(username){
			var userid = null;

			return userid;
		},
		list: {
			get: function(return_users_callback){
				var users = null;

				User.findAll({

				}).then(function(users){
					return_users_callback(users);
				}).catch(function(error){
					console.log(error);
				});


			},
			set: function(data){
				var userlist = null;

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
								console.log("Saved:\t" + o.id + " as " + o.name);
							})
							.catch(function(error){
								console.log("Failed to save user " + o.id + " as " + o.name + "\n" + error);
							});

				});

				return userlist;
			}
		},
		pokemon: {
			get: function(userid, position){
				var pokemon = null;

				return pokemon;
			},
			save: function(userid, position){

			},
			update: function(userid, position){

			},
			release: function(userid, position){

			},
			swap: function(userid, position_1, position_2){

			},
			trade: function(userid_1, position_1, userid_2, position_2){

			},
			sell: function(userid_1, position_1, userid_2, position_2){

			},



			}
		},
	pokemon: {
		pokedex: {
			get: function(data){

			}
		},
		list: {
			get: function(data){

			},
			set: function(data){

			}
		}
	},

}

module.exports = dbHandler;