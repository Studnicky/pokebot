"use strict";
//	Need sequelize ref and data models
var Sequelize = require('sequelize'),
	Models = require(__dirname + '/../sequelize'),
	User = Models.User;

function get_name_by_userid (userid, callback){
	var err = null, response = {};
	User.findOne({
		where: { slack_id: userid },
		attributes: ['slack_name']
	}).then(function(user){
		if(user){
			response = {'slack_name': user.slack_name};
		} else {
			err = 'No user found!';
		}
		return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
	});
}

function get_userid_by_name (username, callback){
	var err = null, response = {};
	User.findOne({
		where: { slack_name: username },
		attributes: ['slack_id']
	}).then(function(user){
		if(user){
			response = {'slack_name': user.slack_id};
		} else {
			err = 'No user found!';
		}
		return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
	});
}

function get_info (userid, callback){
	var err = null, response = {};
	User.findOne({
		where: { slack_id: userid }
	}).then(function(user){
		if(user){
			response = {'user': user};
		} else {
			err = 'User data not found!';
		}
		return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
	});
}

function list_get (callback){
	var err = null, response = {};
	User.findAll({
	}).then(function(users){
		if(user){
			response = {'users': users};
		} else {
			err = 'No users found!';
		}
		return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
	});

}

function list_set (users, callback){
	var err = null, response = {};

	users.map(function(o){
		switch(true){
			case (o.is_primary_owner == true):
				o.permissions_level = 6;
				break;
			case (o.is_owner == true):
				o.permissions_level = 5;
				break;
			case (o.is_bot == true):
				o.permissions_level = 4;
				break;
			case (o.is_admin == true):
				o.permissions_level = 3;
				break;
			case (o.is_restricted == true):
				o.permissions_level = 1;
				break;
			case (o.is_ultra_restricted == true):
				o.permissions_level = 0;
				break;
			default:
				o.permissions_level = 2;
				break;
		}

		//	There is no bulk update in Sequelize :(
		User.upsert({
			slack_id: o.id,
			slack_name: o.name,
			tz_offset: o.tz_offset,	//	Force this in as a string for now
			permissions_level: o.permissions_level,
			position_cap: 30 * o.permissions_level + 6,
			credits: 0
		}).then(function(){
			response = "Saved:\t" + o.id + " as " + o.name;
			return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
		}).catch(function(error){
			response = "Failed to save user " + o.id + " as " + o.name + " \n" + error;
			return (typeof(callback) == 'function') ? callback(err, response) : (err ? console.log(err) : console.log(response));
		});
	});
}

var user = {
	name_by_userid: get_name_by_userid,
	userid_by_name: get_userid_by_name,
	get: get_info,
	list: {
		get: list_get,
		set: list_set
	}
}

module.exports = user;