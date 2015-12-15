//	Local variables
var Sequelize = require('sequelize'),	//	require node module
	database_uri = process.env.DATABASE_URL;	//	Get DB location

//	Global ref for sequelize instance
sequelize = new Sequelize(database_uri, {
	dialect:  'postgres',
	protocol: 'postgres'
});

//	Global ref for postgres handler
postgres = {
	sequelize: sequelize,
	Sequelize: Sequelize,

	//  Define models as attributes from script files
	User: 				sequelize.import(__dirname + '/user_model.js'),
	Pokemon:			sequelize.import(__dirname + '/pokemon_model.js'),
	Pokemon_Instance:	sequelize.import(__dirname + '/pokemon_instance_model.js'),

	initialize: function(){
		console.log('Sequelize initialize...');
		this.associate();
		this.sync();
	},
	associate: function(){ 	//	Create associations
		Object.keys(postgres).forEach(function(modelName) {
			if ('associate' in postgres[modelName]) {
				postgres[modelName].associate(postgres);
			}
		});
	},
	sync: function(){	//	Write schema to database
		postgres.sequelize.sync({force: true}, function(err){
			if(err){
				console.error(err);
				return process.exit(1); 
			}
		}).then(function () {
			console.log("Sequelize successfully created tables!");
		});
	}

};

module.exports = postgres;