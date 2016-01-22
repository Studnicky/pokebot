//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	User = Models.User,
	Pokemon = Models.Pokemon,
	Pokemon_Instance = Models.Pokemon_Instance;

var party = {
	name: 'party',
	methods: {

		count: function(userid, callback){
			Pokemon_Instance.count({
				where: {
					owner_id: String(userid)
				}
			}).then(function(count){
				if(count){
					if (typeof(callback) == 'function'){
						callback(count);
					}
				} else {
					console.log('Count failed');
				}
			}).catch(function(err){
				console.log(error);
			});
		},

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

		get_box: function(userid, box, callback){
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
		},

		get_member: function(userid, position, callback){

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

		swap: function(userid, position_1, position_2){

		},
		trade: function(userid_1, position_1, userid_2, position_2){

		},
		update: function(userid, position){

		},
	}
}

module.exports = party;