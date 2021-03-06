"use strict";
//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	Pokemon = Models.Pokemon,
	Pokemon_Instance = Models.Pokemon_Instance;

var utility = require(__dirname +'/../utility');

function build_instance(pokemon, callback){
	var err = null, response = {};
	var instance = Pokemon_Instance.build({
		caught_by: null,
		current_form: {},
		current_level: Math.ceil(Math.random()*10+5),
		current_happiness: Math.floor(Math.random()*50+30),
		effort_values: {
			"hp":				0,
			"attack":			0,
			"defense":			0,
			"special-attack":	0,
			"special-defense":	0,
			"speed":			0
		},
		exp: 100,
		is_female: (pokemon.has_gender) ? (pokemon.gender_rate - (Math.random()*8) > 0 ? true : false) : false,
		has_pokerus: (Math.floor(Math.random()*21845) == 1) ? true : false,
		holds_item: {},
		individual_values: {
			"hp":				Math.ceil(Math.random()*31),
			"attack":			Math.ceil(Math.random()*31),
			"defense":			Math.ceil(Math.random()*31),
			"special-attack":	Math.ceil(Math.random()*31),
			"special-defense":	Math.ceil(Math.random()*31),
			"speed":			Math.ceil(Math.random()*31)
		},
		is_shiny: (Math.floor(Math.random()*8192) == 1) ? true : false,
		nature: {},
		national_id: pokemon.national_id,
		nickname: utility.display_name(pokemon.name),
		owner_id: null,
		party_position: 0,
		for_trade: 0,
		been_traded: 0,
		for_sale: 0,
		been_sold: 0
	});
	if(instance){
		response = {'instance': instance};
	} else {
		err = 'Failed to build instance!';
	}
	return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
}

function capture(userid, instance, callback){
	var err = null, response = {};
	var party = require(__dirname + '/party');
	party.open_position(userid, 1, function(err, response){
		if(err){
			return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
		} else {
			instance.owner_id = userid;
			instance.caught_by = userid;
			instance.party_position = response.position;
			instance.save().then(function(){
				response = {'position': response.position};
				return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
			}).catch(function(err){
				return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
			});
		}
	});
}

function find_by_rarity(rarity, callback){
	var err = null, response = {};
	Pokemon.findOne({
		where:{
			is_wild: true,
			capture_rate: {$gte: (255-rarity)},
		},
		order: [Sequelize.fn('RANDOM')]
	}).then(function(pokemon){
		if(pokemon){
			response = {'pokemon': pokemon};
		} else {
			err = 'No Pokemon found!';
		}
		return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
	}).catch(function(err){
		console.log(err);
	});
}

function spawn(rarity, callback){
	var err = null, response = {};
	rarity = (rarity) ? rarity : Math.floor(Math.random()*254)+1;
	find_by_rarity(rarity, function(err, response){
		if(err){
			return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
		} else {
			var pokemon = response.pokemon;
			build_instance(response.pokemon, function(err, response){
				if(err){
					return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
				} else {
					response = {'pokemon':pokemon, 'instance': response.instance};
					return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
				}
			});
		}
	});
}

function starter_list(callback){
	var err = null, response = {};
	Pokemon.findAll({
		attributes: ['name', 'generation', 'national_id'],
		order: [['name', 'ASC']],
		where:{
			is_starter: true
		}
	}).then(function(starters){
		if(starters){
			response = {'starters': starters};
		} else {
			err = 'There are no Pokemon labelled as starters!';
		}
		return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
	});
}

function starter_pick(userid, pick, callback){	//	This is why I need to read up on the async library... not all these actions should be blocking.
	var party = require(__dirname + '/party');
	var err = null, response = {};
	party.count(userid, function(err, response){	//	Get party count...
		if(err){
			return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));	
		} else if (response.count != 0) {
			err = 'You already have a Pokemon!';
			return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
		} else {
			//	If starter in list
			starter_list(function(err, response){	//	Check that it's a valid starter...
				if(err){
					return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));	
				} else {
					var pokemon = null;
					response.starters.map(function(starter){
						if (pick.toLowerCase() == starter.name.toLowerCase()){
							pokemon = starter;
						}
					});
					if(!pokemon){
						err = '"' + pick + '" is not an available starter!';
						return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));	
					} else {
						build_instance(pokemon, function(err, response){	//	Build new instance...
							if(err){
								return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));	
							} else {
								var instance = response.instance;
								capture(userid, instance, function(err, response){	//	'Capture' the pokemon
									if(err){
										return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
									} else {
										response = {'pokemon': pokemon, 'instance': instance};
										return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
									}
								});
							}
						});
					}
				}
			});	
		}
	});
}

var pokemon = {
	build_instance: build_instance,
	capture: capture,
	find_by_rarity:find_by_rarity,
	spawn:spawn,
	starter_list: starter_list,
	starter_pick: starter_pick
}

module.exports = pokemon;