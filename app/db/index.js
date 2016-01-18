//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	User = Models.User,
	Pokemon = Models.Pokemon,
	Pokemon_Instance = Models.Pokemon_Instance;


console.log('DB wrapper initialize...');

var db = {
	user: {
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
							// console.log("Saved:\t" + o.id + " as " + o.name);
						})
						.catch(function(error){
							// console.log("Failed to save user " + o.id + " as " + o.name + "\n" + error);
						});

				});
			}
		},
		party: {
			get: function(userid, box, callback){
				Pokemon_Instance.findAll({
					attributes: ['party_position', 'Pokemon.name'],
					order: [['party_position', 'ASC']],
					where: {
						owner_id: userid,
						party_position: {$between: [box*6-6, box*6]}
					},
					include: [
						{model: Pokemon}
					]
				}).then(function(party_members){
					if(party_members.length > 0 && typeof(callback) == 'function'){
						callback(party_members);
					} else {
						console.log('No party found!');
					}

				})
			}
		},
		pokemon: {
			get: function(userid, position, callback){

				Pokemon_Instance.findOne({
					where: {
						owner_id: userid,
						party_position: position
					},
					include: [
						{model: Pokemon}
					]
				})
				.then(function(this_pokemon){
					if(this_pokemon && typeof(callback) == 'function'){
						callback(this_pokemon);
					} else {
						console.log('No pokemon exists');
					}

				});

			},
			release: function(userid, position){
				Pokemon_Instance.destroy({
					where: {
						owner_id: userid,
						party_position: position
					}
				}).then(function(affectedRows){
					console.log('Released: ' + position + " " + (affectedRows == 1 ? "successful" : "failure"));
				});
			},
			save: function(userid, pokemon){

				//	Find an open position...
				db.user.find_open_position(userid, function(open_positions){

					if(open_positions.length != 0){	//	If there is an opening...

						var pokemon_instance = Pokemon_Instance.build({
							caught_by: userid,
							current_form: {},
							current_level: 5,
							current_happiness: 100,
							effort_values: [{}],
							exp: 100,
							gender: 1,
							has_pokerus: false,
							holds_item: {},
							individual_values: [{}],
							is_shiny: false,
							nature: {},
							national_id: pokemon,
							nickname: null,
							owner_id: userid,
							party_position: open_positions[0],
							for_trade: 0,
							been_traded: 0,
							for_sale: 0,
							been_sold: 0
						});
					//	Set toggles and stats!
					pokemon_instance.initialize_new();
					pokemon_instance.save();
					console.log('Saved at: ' + open_positions[0]);

				} else {	//	@TODO:: Error handling dispatcher
					console.log('No positions open!');
				}

			});

			},
			// sell: function(userid_1, position_1, userid_2, position_2, price){

			// },
			swap: function(userid, position_1, position_2){

			},
			// trade: function(userid_1, position_1, userid_2, position_2){

			// },
			update: function(userid, position){

			},



			}
		},
		pokemon: {
			spawn: function(rarity, callback){
				Pokemon.findOne({
					where:{
						is_wild: true,
					//	Invert for UX clarity (rarity as ascending numbers instead of descending)
					catch_rate: {$gte: (255-rarity)},
				},
				order: [
				Sequelize.fn('RANDOM')
				]
			}).then(function(this_pokemon){

				if(this_pokemon && typeof(callback) == 'function'){

					var pokemon_instance = Pokemon_Instance.build({
						caught_by: "wild",
						current_form: {},
						effort_values: [{}],
						exp: 100,		//	bigint calc level?
						gender: 1,
						current_happiness: Math.floor(Math.random()*50)+50,				//	rand range 0-100 -> 255 max
						has_pokerus: Math.floor(Math.random()*21845) == 1 ? true : false,
						holds_item: {},
						individual_values: [{}],
						is_shiny: Math.floor(Math.random()*8192) == 1 ? true : false,	//	rand range 1:8192 -> true
						nature: {},
						national_id: this_pokemon.national_id,
						nickname: null,
						owner_id: "wild",
						party_position: 0,
						for_trade: 0,
						been_traded: 0,
						for_sale: 0,
						been_sold: 0
					});

					callback(pokemon_instance);

				} else {
					console.log('No pokemon of specified rarity found');
				}

			}).catch(function(err){
				console.log(error);
			});
		},
		pokedex: function(data){

		}

	},

}

module.exports = db;