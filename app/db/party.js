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
			var err = null, response = {};

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
			var err = null, response = {};

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
			var err = null, response = {};

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
					err = 'This box is empty!';
				}
				(typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
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
				(typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
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
				(typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
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
					err = 'Failed to put pokemon into new position.';
				}
				(typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
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
				(typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
			});
		},

		swap: function(userid, position_1, position_2, callback){
			var err = null, response = {};

			//	Passthrough method to get instances
			this.get_member(userid, position_1, function(err, instance_1){	//	null is valid reponse
				this.get_member(userid, position_2, function(err, instance_2){	//	null is valid response
					
					if(instance_1.instance != null && instance_2.instance != null){
						this.switch_positions(userid, instance_1.instance, instance_2.instance, callback);
					} else if(instance_1.instance == null && instance_2.instance != null){
						this.put_position(userid, instance_2.instance, position_1, callback);
					} else if(instance_1.instance != null && instance_2.instance == null){
						this.put_position(userid, instance_1.instance, position_2, callback);
					} else if(instance_1.instance == null && instance_2.instance == null){
						err = 'Both positions cannot be empty!';
						(typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
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
									err = 'Operation failed at: Set instance_1 position ' + position_2
								}
								(typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
							});
						} else {
							err = 'Operation failed at: Set instance_2 position ' + position_1;
							(typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
						}
					});
				} else {
					err = 'Operation failed at: Set instance 1 position 0';
					(typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));	
				}
			});	

		},
		// trade: function(userid_1, position_1, userid_2, position_2){

		// }
	}
}

module.exports = party;