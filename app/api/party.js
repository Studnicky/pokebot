"use strict";
//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	User = Models.User,
	Pokemon = Models.Pokemon,
	Pokemon_Instance = Models.Pokemon_Instance;

var utility = require(__dirname +'/../utility');

var party = {
		count: function(userid, callback){
			var err = null, response = {};
			Pokemon_Instance.count({
				where: {
					owner_id: userid
				}
			}).then(function(count){
				if(count){
					response = {'count': count};
				} else {
					err = 'Nothing to count!';
				}
				return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
			});
		},

		find_open_position: function(userid, callback){
			var err = null, response = {};

			User.findOne({
				where: { slack_id: userid },
				attributes: ['position_cap'],
				include: [{
					model: Pokemon_Instance,
					attributes: ['party_position'],
					order: [['party_position', 'ASC']]
				}]
			}).then(function(user){

				var open_positions = [], count = 1;
				while(count <= user.position_cap){
					open_positions.push(count++);
				};

				user.Pokemon_Instances.map(function(o){
					if(open_positions.indexOf(o.party_position) != -1){
						open_positions.splice(open_positions.indexOf(o.party_position), 1);
					}
				});
				if (typeof(callback) == 'function'){
					return callback(open_positions);
				}
			});
		},

		find_open_storage: function(userid, start, callback){
			var err = null, response = {};
			User.findOne({
				where: { slack_id: userid },
				attributes: ['position_cap'],
				include: [{
					model: Pokemon_Instance,
					attributes: ['party_position'],
					order: [['party_position', 'ASC']]
				}]
			}).then(function(user){
				var open_positions = [], count = start;
				while(count <= user.position_cap){
					open_positions.push(count++);
				};
				user.Pokemon_Instances.map(function(o){
					if(open_positions.indexOf(o.party_position) != -1){
						open_positions.splice(open_positions.indexOf(o.party_position), 1);
					}
				});
				if(open_positions.length > 0){
					response = {'position': open_positions[0]};
				} else {
					err = 'No open storage!';
				}
				return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
			});
		},

		get_box: function(userid, box, callback){
			var err = null, response = {};

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
			}).then(function(box_members){
				if(box_members.length > 0){
					response = {'box_members': box_members};
				} else {
					err = 'Storage box #' + box + ' is empty!';
				}
				return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
			})
		},

		get_member: function(userid, position, callback){
			var err = null, response = {};

			Pokemon_Instance.findOne({
				where: {
					owner_id: userid,
					party_position: position
				},
				include: [
					{model: Pokemon}
				]
			})
			.then(function(instance){
				if(instance){
					response = {'instance': instance};
				} else {
					err = 'Nothing found at that position!'
					response = {'instance': null};
				}
				return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
			});
		},
		
		get_party: function(userid, callback){
			var err = null, response = {};

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
				if(party_members.length > 0){
					response = {'party_members': party_members};
				} else {
					err = 'No party members located!';
				}
				return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
			});
		},

		put_position: function(userid, instance, position, callback){
			var err = null, response = {};
			Pokemon_Instance.update(
				{party_position: position},
				{where: {party_position: instance.party_position}}
			).then(function(affectedRows){
				if(affectedRows == 1){
					response = {instances: [{'instance': instance, 'pokemon': instance.Pokemon, 'new_position': position}]};
				} else {
					console.log('rows: 0');
					err = 'Failed to put pokemon into new position.';
				}
				return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
			});
		},

		release: function(userid, position, callback){
			var err = null, response = {};
			Pokemon_Instance.destroy({
				where: {
					owner_id: userid,
					party_position: position
				}
			}).then(function(affectedRows){
				if(affectedRows == 1){
					response = {'position': position};
				} else {
					err = 'No pokemon to found at that position!'
				}
				return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
			});
		},

		store: function(userid, position, callback){
			var err = null, response = {};

			//	Passthrough method to get instances
			this.api.party.get_member(userid, position, function(err, response){
				if(response.instance != null){
					console.log('got-instance');
					console.log(response.instance);
					var instance = response.instance;
					this.api.party.find_open_storage(userid, 7, function(err, response){
						this.api.party.put_position(userid, instance, response.position, callback);
					}.bind(this));
				} else {
					err = 'Nothing in position to move!';
					return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
				}
			}.bind(this));
		},

		retrieve: function(userid, position, callback){
			var err = null, response = {};
			//	Passthrough method to get instances
			this.api.party.get_member(userid, position, function(err, response){
				if(response.instance != null){
					var instance = response.instance;
					this.api.party.find_open_storage(userid, 1, function(err, response){
						if(response.position <= 6){
							this.api.party.put_position(userid, instance, response.position, callback);
						} else {
							err = 'No open space in party!';
							return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
						}
					}.bind(this));		
				} else {
					err = 'Nothing in position to move!';
					return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
				}
			}.bind(this));
		},

		swap: function(userid, position_1, position_2, callback){
			var err = null, response = {};

			//	Passthrough method to get instances
			this.api.party.get_member(userid, position_1, function(err, response_1){	//	null is valid reponse
				this.api.party.get_member(userid, position_2, function(err, response_2){	//	null is valid response
					
					if(response_1.instance != null && response_2.instance != null){
						this.api.party.switch_positions(userid, response_1.instance, response_2.instance, callback);
					} else if(response_1.instance == null && response_2.instance != null){
						this.api.party.put_position(userid, response_2.instance, position_1, callback);
					} else if(response_1.instance != null && response_2.instance == null){
						this.api.party.put_position(userid, response_1.instance, position_2, callback);
					} else if(response_1.instance == null && response_2.instance == null){
						err = 'Both positions cannot be empty!';
						return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
					}

				}.bind(this));
			}.bind(this));
		},

		switch_positions: function(userid, instance_1, instance_2, callback){
			var err = null, response = {};
			var position_1 = instance_1.party_position;
			var position_2 = instance_2.party_position;

			// This should *really* be a transact...
			Pokemon_Instance.update(
				{party_position: 0},
				{where: {party_position: position_1}}
			).then(function(affectedRows){
				if(affectedRows == 1){
					Pokemon_Instance.update(
						{party_position: position_1},
						{where: {party_position: position_2}}
					).then(function(affectedRows){
						if(affectedRows == 1){
							Pokemon_Instance.update(
								{party_position: position_2},
								{where: {party_position: 0}}
							).then(function(affectedRows){
								if(affectedRows == 1){
									response = {instances: [{'instance': instance_1, 'pokemon': instance_1.Pokemon,  'new_position': position_2},
											{'instance': instance_2, 'pokemon': instance_2.Pokemon,  'new_position': position_1}]};
								} else {
									err = 'Operation failed at: Set instance 1 position ' + position_2
								}
								return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
							});
						} else {
							err = 'Operation failed at: Set instance 2 position ' + position_1;
							return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
						}
					});
				} else {
					err = 'Operation failed at: Set instance 1 position 0';
					return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));	
				}
			});	

		},
		// trade: function(userid_1, position_1, userid_2, position_2){

		// }
}

module.exports = party;