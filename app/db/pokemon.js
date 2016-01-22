//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	User = Models.User,
	Pokemon = Models.Pokemon,
	Pokemon_Instance = Models.Pokemon_Instance;

var pokemon = {
	name: 'pokemon',
	methods: {

		build_instance: function(pokemon, callback){

			var pokemon_instance = Pokemon_Instance.build({
				caught_by: null,
				current_form: {},
				current_level: 5,
				current_happiness: Math.floor(Math.random()*50+50),
				effort_values: [
					{name: 'attack',	value: 0},
					{name: 'defense',	value: 0},
					{name: 'hp',		value: 0},
					{name: 'sp_atk',	value: 0},
					{name: 'sp_def',	value: 0},
					{name: 'speed',		value: 0}
				],
				exp: 100,
				gender: 1,
				has_pokerus: (Math.floor(Math.random()*21845) == 1) ? true : false,
				holds_item: {},
				individual_values: [
					{name: 'attack',	value: Math.ceil(Math.random()*31)},
					{name: 'defense',	value: Math.ceil(Math.random()*31)},
					{name: 'hp',		value: Math.ceil(Math.random()*31)},
					{name: 'sp_atk',	value: Math.ceil(Math.random()*31)},
					{name: 'sp_def',	value: Math.ceil(Math.random()*31)},
					{name: 'speed',		value: Math.ceil(Math.random()*31)}
				],
				is_shiny: (Math.floor(Math.random()*8192) == 1) ? true : false,
				nature: {},
				national_id: pokemon.national_id,
				nickname: null,
				owner_id: null,
				party_position: 0,
				for_trade: 0,
				been_traded: 0,
				for_sale: 0,
				been_sold: 0
			});
			
			if(pokemon_instance){
				if (typeof(callback) == 'function'){
					callback(pokemon_instance);
				}
			} else {
				console.log('Failed to build instance');
			}

		},

		capture: function(userid, pokemon_instance, position, callback){

			pokemon_instance.owner_id = userid;
			pokemon_instance.caught_by = userid;
			pokemon_instance.party_position = position;

			pokemon_instance.save().then(function(){
				callback('Stored at: ' + position);
			}).catch(function(err){
				console.log('Failed to save');
				console.log(err);
			});

		},

		find: function(id_or_name, callback){

			var where = isNaN(parseInt(id_or_name, 10)) ? {name: {$ilike: id_or_name}} : {national_id: id_or_name};

			Pokemon.findOne({
				where: where
			}).then(function(this_pokemon){
				if(this_pokemon){
					if(typeof(callback) == 'function'){
						callback(this_pokemon);		
					}				
				} else {
					console.log("Pokemon not found");
				}
			}).catch(function(err){
				console.log(err);
			});
		},

		spawn: function(rarity, callback){
			Pokemon.findOne({
				where:{
					is_wild: true,
					//	Invert for UX clarity (rarity as ascending numbers instead of descending)
					catch_rate: {$gte: (255-rarity)},
				},
				order: [Sequelize.fn('RANDOM')]
			}).then(function(wild_pokemon){
				if(wild_pokemon){
					if (typeof(callback) == 'function'){
						callback(wild_pokemon);
					}
				} else {
					console.log('No pokemon of specified rarity found');
				}
			}).catch(function(err){
				console.log(error);
			});
		},

		starter_list: function(callback){
			Pokemon.findAll({
				attributes: ['name', 'gen', 'national_id'],
				order: [['name', 'ASC']],
				where:{
					is_starter: true
				}
			}).then(function(starters){
				if(starters){
					if (typeof(callback) == 'function'){
						callback(starters);
					}
				}
			}).catch(function(err){
				console.log(error);
			});;
		},


	}
}

module.exports = pokemon;