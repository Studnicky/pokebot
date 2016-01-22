//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	User = Models.User,
	Pokemon = Models.Pokemon,
	Pokemon_Instance = Models.Pokemon_Instance;

var party = {
	name: 'party',
	methods: {
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
	}
}

module.exports = party;