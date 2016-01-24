//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	User = Models.User,
	Pokemon = Models.Pokemon,
	Pokemon_Instance = Models.Pokemon_Instance;

var utility = require(__dirname +'/../utility');

var party = {
	name: 'party',
	methods: {

		count: function(userid, callback){
			Pokemon_Instance.count({
				where: {
					owner_id: userid
				}
			}).then(function(count){
				if(typeof(count)=='number'){
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

		find_open_storage: function(userid, callback){
			User.findOne({
				where: { slack_id: userid },
				attributes: ['position_cap'],
				include: [{
					model: Pokemon_Instance,
					attributes: ['party_position'],
					order: [['party_position', 'ASC']]
				}]
			}).then(function(this_user){

				var open_positions = [], count = 7;
				while(count <= this_user.position_cap){
					open_positions.push(count++);
				};

				this_user.Pokemon_Instances.map(function(o){
					if(open_positions.indexOf(o.party_position) != -1){
						open_positions.splice(open_positions.indexOf(o.party_position), 1);
					}
				});
				if(typeof(callback) == 'function'){
					callback(open_positions[0]);
				}
			});
		},

		get: function(userid, callback){
			Pokemon_Instance.findAll({
				order: [['party_position', 'ASC']],
				where: {
					owner_id: userid,
					party_position: {$between: [0, 6]}
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

		box_get: function(userid, box, callback){

			Pokemon_Instance.findAll({
				attributes: ['party_position', 'Pokemon.name'],
				order: [['party_position', 'ASC']],
				where: {
					owner_id: userid,
					party_position: {$between: [(box)*30+7-30, (box)*30+6]}
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

		member_get: function(userid, position, callback){
			console.log('member get');
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
					console.log('instance found');
					callback(this_pokemon);
				} else {
					console.log('instance not found');
					callback(null);
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

		swap: function(userid, position_1, position_2, callback){
			console.log('Postion 1: ' + position_1);
			console.log('Postion 2: ' + position_2);

			this.member_get(userid, position_1, function(instance_1){
				this.member_get(userid, position_2, function(instance_2){
					switch(true){
						case (instance_2 == null):
							Pokemon_Instance.update(
								{party_position:position_2},
								{where: {party_position:position_1}}
							).then(function(affectedRows){
								var response = '';
								if(position_2 < 7){
									response = utility.pokemon_emoji(instance_1.Pokemon, instance_1) + " added to party at position " + position_2 + ".";
								} else {
									response = utility.pokemon_emoji(instance_1.Pokemon, instance_1) + " sent to storage box " + utility.get_box(position_2) + " at position " + utility.get_box_position(position_2) + ".";
								}
								return callback(response);
							});
							break;
						case (instance_1 == null):
							Pokemon_Instance.update(
								{party_position:position_1},
								{where: {party_position:position_2}}
							).then(function(affectedRows){
								var response = '';
								if(position_1 < 7){
									response = utility.pokemon_emoji(instance_2.Pokemon, instance_2) + " added to party at position " + position_1 + ".";
								} else {
									response = utility.pokemon_emoji(instance_2.Pokemon, instance_2) + " sent to storage box " + utility.get_box(position_1) + " at position " + utility.get_box_position(position_1) + ".";
								}
								return callback(response);
							});
							break;
						default:
							Pokemon_Instance.update(
								{party_position:0},
								{where: {party_position:position_1}}
							).then(function(affectedRows){
								if(affectedRows == 1){
									Pokemon_Instance.update(
										{party_position:position_1},
										{where: {party_position:position_2}}
									).then(function(affectedRows){
										if(affectedRows == 1){
											Pokemon_Instance.update(
												{party_position:position_2},
												{where: {party_position:0}}
											).then(function(affectedRows){
												var response = '';
												if(position_1 < 7){
													response += utility.pokemon_emoji(instance_2.Pokemon, instance_2) + " added to party at position " + position_1 + ".\n";
												} else {
													response += utility.pokemon_emoji(instance_2.Pokemon, instance_2) + " sent to storage box " + utility.get_box(position_1) + " at position " + utility.get_box_position(position_1) + ".\n";
												}
												if(position_2 < 7){
													response += utility.pokemon_emoji(instance_1.Pokemon, instance_1) + " added to party at position " + position_2 + ".\n";
												} else {
													response += utility.pokemon_emoji(instance_1.Pokemon, instance_1) + " sent to storage box " + utility.get_box(position_2) + " at position " + utility.get_box_position(position_2) + ".\n";
												}
												return callback(response);
											});
										} else {
											return callback('Failed to swap positions!');
										}
									});
								} else {
									return callback('Failed to swap positions!');
								}
							});	
							break;
					}
					//	I mean if they're both null, who cares?
				});
			}.bind(this));
		},
		// trade: function(userid_1, position_1, userid_2, position_2){

		// }
	}
}

module.exports = party;