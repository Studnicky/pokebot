//	Description:
//		Database configuration file
//
//	Dependencies:
//		Sequelize
//
//	Configuration:
//		None
//
//	Commands:
//		None
//
//	Author:
//		Andrew Studnicky

var Sequelize = require('sequelize'),	//	require node module
	sequelize = null,					//	create an empty class reference
	postgres = {};						//	create empty DB object

//	Define database connection from env variable, default to local if not present
var database_uri = process.env.DATABASE_URL || 'postgres://pokebot:oak@localhost:5432/pokebot';

//	instaniate a new Sequelize class
sequelize = new Sequelize(database_uri, {
	dialect:  'postgres',
	protocol: 'postgres'
});

//	Build our reference object
postgres = {
	sequelize: sequelize,
	Sequelize: Sequelize, 
	//  Define models as attributes from script files
	User: 				sequelize.import(__dirname + '/user_model.js'),
	Pokemon:			sequelize.import(__dirname + '/pokemon_model.js'),
	Pokemon_Instance:	sequelize.import(__dirname + '/pokemon_instance_model.js')
};

//	Create table associations from models
Object.keys(postgres).forEach(function(modelName) {
  if ('associate' in postgres[modelName]) {
    postgres[modelName].associate(postgres);
  }
});

postgres.sequelize.sync({force: true}, function(err){
	if(err){
		console.error(err);
		return process.exit(1); 
	}
}).then(function () {
	console.log("\nSuccessfully created tables\n");
});

module.exports = postgres;