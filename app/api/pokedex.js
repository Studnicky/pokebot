"use strict";
//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	Pokemon = Models.Pokemon;

function find_by_name_or_id (national_id_or_name, callback){
	var err = null, response = {};
	var where = isNaN(parseInt(national_id_or_name, 10)) ? {name: {$ilike: national_id_or_name}} : {national_id: national_id_or_name};

	Pokemon.findOne({
		where: where
	}).then(function(pokemon){
		if(pokemon){
			response = {'pokemon': pokemon.get()};
		} else {
			err = 'Failed to look up Pokemon: ' + national_id_or_name + '!';
		}
		return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
	}).catch(function(err){
		console.log(err);
	});
}

var pokedex = {
	get: find_by_name_or_id
}
module.exports = pokedex;