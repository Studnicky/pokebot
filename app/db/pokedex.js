//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	User = Models.User,
	Pokemon = Models.Pokemon,
	Pokemon_Instance = Models.Pokemon_Instance;

var pokedex = {
	name: 'pokedex',
	methods: {
		get: function(data){

		}
	}
}
module.exports = pokedex;