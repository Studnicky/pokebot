var path = require('path');
var fs = require('fs');

var postgres = {};

console.log('** Sequelize initialize...');

postgres.Sequelize = require('sequelize');
postgres.sequelize = new postgres.Sequelize(process.env.DATABASE_URL, {
	dialect:  'postgres',
	protocol: 'postgres',
	logging: false,
	force: false	//	Drop all tables on creation (use when migrations have occurred)
});

//	Get all the non-system files in this directory...
fs.readdirSync(__dirname).filter(function(file){
	return (file.indexOf(".") !== 0) && (file !== "index.js");
}).map(function(file){	//	Import them into sequelize as models.
	var model = postgres.sequelize.import(path.join(__dirname, file));
	postgres[model.name] = model;
});

//	Go back through those models and run the associate method if they have one.
Object.keys(postgres).map(function(attribute) {
	if ('associate' in postgres[attribute]) {
		postgres[attribute].associate(postgres);
	}
});

module.exports = postgres;