//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	User = Models.User,
	Pokemon = Models.Pokemon,
	Pokemon_Instance = Models.Pokemon_Instance;

var pokemon = {
	name: 'pokemon',
	methods: {
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
}

module.exports = pokemon;