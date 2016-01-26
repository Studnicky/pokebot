"use strict";
//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
Models = require(__dirname + '/../sequelize'),
User = Models.User,
Pokemon = Models.Pokemon,
Pokemon_Instance = Models.Pokemon_Instance;

var utility = require(__dirname +'/../utility');

<<<<<<< HEAD
function count (userid, callback){
=======
var count = function(userid, callback){
>>>>>>> fd7bd9e5f69cbc27cfc42ec5ccd50007745d817a
	var err = null, response = {};
	Pokemon_Instance.count({
		where: {
			owner_id: userid
		}
	}).then(function(count){
<<<<<<< HEAD
		//	Count has no error condition, it will return a value or 0
		response = {'count': count};
		return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
	});
}

function open_position (userid, start, callback){
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
		if(user){
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
		} else {
			err = 'User not found!';
		}
		return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));			
	});
}

function get_box(userid, box, callback){
	var err = null, response = {};
	Pokemon_Instance.findAll({
		attributes: ['party_position', 'Pokemon.name'],
		order: [['party_position', 'ASC']],
		where: {
			owner_id: userid,
			party_position: {$between: [(box)*30+7-30, (box)*30+6]}
		},
		include: [{
				model: Pokemon
		}]
	}).then(function(box_members){
		if(box_members){
			if(box_members.length > 0){
				response = {'box_members': box_members};
			} else {
				err = 'Storage box #' + box + ' is empty!';
			}
		} else {
			err = 'Storage box not found!';	
=======
		if(count){
			response = {'count': count};
		} else {
			err = 'Nothing to count!';
		}
		return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
	});
}

var find_open_position = function(userid, callback){
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
}

var find_open_storage= function(userid, start, callback){
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
>>>>>>> fd7bd9e5f69cbc27cfc42ec5ccd50007745d817a
		}
		return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
	});
}

<<<<<<< HEAD
function get_member (userid, position, callback){
	var err = null, response = {};
	Pokemon_Instance.findOne({
		where: {
			owner_id: userid,
			party_position: position
		},
		include: [{
			model: Pokemon
		}]
	})
	.then(function(instance){
		if(instance){
			response = {'instance': instance};
		} else {
			err = 'Nothing found at that position!'
			response = {'instance': null};	//	Some methods can take null instances
		}
		return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
	});
}

function get_party (userid, callback){
	var err = null, response = {};
	Pokemon_Instance.findAll({
		order: [['party_position', 'ASC']],
		where: {
			owner_id: userid,
			party_position: {$between: [0, 6]}
		},
		include: [{
			model: Pokemon
		}]
	}).then(function(party_members){
		if(party_members){
			if(party_members.length > 0){
				response = {'party_members': party_members};
			} else {
				err = 'Your party is empty!';
			}
		} else {
			err = 'Member party not found!';	
=======
var get_box= function(userid, box, callback){
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
}

var get_member= function(userid, position, callback){
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
>>>>>>> fd7bd9e5f69cbc27cfc42ec5ccd50007745d817a
		}
		return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
	});
}

<<<<<<< HEAD
function move_position (userid, instance, position, callback){
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
}

function release (userid, position, callback){
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
=======
var get_party= function(userid, callback){
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
>>>>>>> fd7bd9e5f69cbc27cfc42ec5ccd50007745d817a
		}
		return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
	});
}

<<<<<<< HEAD
function store (userid, position, callback){
	var err = null, response = {};
	//	Passthrough method to get instances
	get_member(userid, position, function(err, response){
		if(response.instance != null){
			var instance = response.instance;
			open_position(userid, 7, function(err, response){
				move_position(userid, instance, response.position, callback);
			});
		} else {
			err = 'Nothing in position to move!';
			return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
		}
	});
}

function retrieve (userid, position, callback){
	var err = null, response = {};
	get_member(userid, position, function(err, response){
		if(response.instance != null){
			var instance = response.instance;
			open_position(userid, 1, function(err, response){
				if(response.position <= 6){
					move_position(userid, instance, response.position, callback);
=======
var put_position= function(userid, instance, position, callback){
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
	}

	var release= function(userid, position, callback){
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
	}

	var store = function(userid, position, callback){
		var err = null, response = {};

			//	Passthrough method to get instances
			get_member(userid, position, function(err, response){
				if(response.instance != null){
					console.log('got-instance');
					console.log(response.instance);
					var instance = response.instance;
					find_open_storage(userid, 7, function(err, response){
						put_position(userid, instance, response.position, callback);
					});
>>>>>>> fd7bd9e5f69cbc27cfc42ec5ccd50007745d817a
				} else {
					err = 'No open space in party!';
					return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
				}
<<<<<<< HEAD
			});		
		} else {
			err = 'Nothing in position to move!';
			return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
		}
	});
}

function swap (userid, position_1, position_2, callback){
	var err = null, response = {};
	get_member(userid, position_1, function(err, response_1){		//	ignore err, null is valid reponse
		get_member(userid, position_2, function(err, response_2){	//	ignore err, null is valid response
			if(response_1.instance != null && response_2.instance != null){
				switch_positions(userid, response_1.instance, response_2.instance, callback);
			} else if(response_1.instance == null && response_2.instance != null){
				move_position(userid, response_2.instance, position_1, callback);
			} else if(response_1.instance != null && response_2.instance == null){
				move_position(userid, response_1.instance, position_2, callback);
			} else if(response_1.instance == null && response_2.instance == null){
				err = 'Both positions cannot be empty!';
				return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
			}
		});
	});
}

function switch_positions(userid, instance_1, instance_2, callback){
	var err = null, response = {};
	var position_1 = instance_1.party_position;
	var position_2 = instance_2.party_position;
=======
			});
		}

		var retrieve = function(userid, position, callback){
			var err = null, response = {};
			//	Passthrough method to get instances
			get_member(userid, position, function(err, response){
				if(response.instance != null){
					var instance = response.instance;
					find_open_storage(userid, 1, function(err, response){
						if(response.position <= 6){
							put_position(userid, instance, response.position, callback);
						} else {
							err = 'No open space in party!';
							return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
						}
					});		
				} else {
					err = 'Nothing in position to move!';
					return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
				}
			});
		}

		var swap = function(userid, position_1, position_2, callback){
			var err = null, response = {};

			//	Passthrough method to get instances
			get_member(userid, position_1, function(err, response_1){	//	null is valid reponse
				get_member(userid, position_2, function(err, response_2){	//	null is valid response
					
					if(response_1.instance != null && response_2.instance != null){
						switch_positions(userid, response_1.instance, response_2.instance, callback);
					} else if(response_1.instance == null && response_2.instance != null){
						put_position(userid, response_2.instance, position_1, callback);
					} else if(response_1.instance != null && response_2.instance == null){
						put_position(userid, response_1.instance, position_2, callback);
					} else if(response_1.instance == null && response_2.instance == null){
						err = 'Both positions cannot be empty!';
						return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
					}

				});
			});
		}

		var switch_positions = function(userid, instance_1, instance_2, callback){
			var err = null, response = {};
			var position_1 = instance_1.party_position;
			var position_2 = instance_2.party_position;
>>>>>>> fd7bd9e5f69cbc27cfc42ec5ccd50007745d817a

	// This should *really* be a transact...
	Pokemon_Instance.update(
		{party_position: 0},
		{where: {party_position: position_1}}
	).then(function(affectedRows){
		if(affectedRows < 1){
			err = 'Operation failed at: Set instance 1 position 0';	
			return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
		} else {
			Pokemon_Instance.update(
<<<<<<< HEAD
				{party_position: position_1},
				{where: {party_position: position_2}}
			).then(function(affectedRows){
				if(affectedRows < 1){
					err = 'Operation failed at: Set instance 2 position ' + position_1;
					return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
				} else {
					Pokemon_Instance.update(
						{party_position: position_2},
						{where: {party_position: 0}}
					).then(function(affectedRows){
						if(affectedRows < 1){
							err = 'Operation failed at: Set instance 1 position ' + position_2
						} else {
							response = {instances: [{'instance': instance_1, 'pokemon': instance_1.Pokemon,  'new_position': position_2},
							{'instance': instance_2, 'pokemon': instance_2.Pokemon,  'new_position': position_1}]};
						}
						return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
					});
				}
			});
		}
	});
}

var party = {
	count: count,
	open_position: open_position,
	get_box: get_box,
	get_member: get_member,
	get_party: get_party,
	move_position: move_position,
	release: release,
	store: store,
	retrieve: retrieve,
	swap: swap,
	switch_positions: switch_positions
}


module.exports = party;
=======
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

}

module.exports = {
		count: count,
		find_open_position: find_open_position,
		find_open_storage: find_open_storage,
		get_box: get_box,
		get_member: get_party,
		put_position: put_position,
		release: release,
		store: store,
		retrieve: retrieve,
		swap: swap,
		switch_positions: switch_positions
}
>>>>>>> fd7bd9e5f69cbc27cfc42ec5ccd50007745d817a