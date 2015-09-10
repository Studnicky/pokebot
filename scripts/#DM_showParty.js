//  Description:
//    Show owned pokemon.
//
//  Dependencies:
//		None
//
//  Configuration:
//		None
//
//  Commands:
//		 hubot party           - Show your current party members.
//
//  Author:
//    Andrew Studnicky

//	Define required modules
var Sequelize = require('sequelize');

//	Define required data models
var Models = require('./models'),
	Pokemon = Models.Pokemon,
	Pokemon_Instance = Models.Pokemon_Instance;

//	Get the utility functions
var Utilities = require('./utility');

module.exports = function showParty (robot) {

	robot.respond(/party?\s*(.*)$/i, {id: 'party.show'}, function (res) {

		if (res.message.room != res.message.user.name) {

			res.reply("Please private message me!");
			return;

		} else {

			//	Get what the user gave us - capture group 2 is the important part. If it doesn't exist, pretend it's empty.
			var userQuery = res.match[1].trim() || null;
			var replyMessage = '';

			//	Play regex-plinko with the response to figure out what to do...
			switch (true) {

				//	TODO:: Preload in the user's party roster, allow match by nickname|name

				case (/[member|number|position]\s*([1-6])/ig.test(userQuery)):
					//	If they asked for a specific pokemon, show his stats
					var position = userQuery.match(/[1-6]/)[0];
					getPartyMember(res, position);
					break;

				case (/(all|any|members)/ig.test(userQuery)):
					//	Show all current party members
					getPartyRoster(res);
					break;

				// TODO::  party swap + party members (@username) + party box [0-?]
				// case (/()/ig.test(userQuery)):
				// 	break;

				default:
					//	Base command or not understood. The user needs help, so send a help message.
					var commands = ["party member <number>", "party members"];
					replyMessage += "Use the following commands to view party info.\n";
					commands.forEach(function(element){
						replyMessage += "•\t" + element + "\n";
					});
					res.send(replyMessage);

			}
		
		}

	});

	function getPartyMember(res, position){

		Pokemon_Instance.findOne({
			attributes: ['party_position', 'Pokemon.name'],
			where: {
				owner_id: String(res.message.user.id),
				party_position: position
			},
			include: [
				{model: Pokemon}
			]
		})
		.then(function(member){
			if(member){
				var replyMessage = "Your " + Utilities.numeral_suffix(member.party_position) + " party member is:\n";
				replyMessage += ":" + member.Pokemon.name.toLowerCase() + ": " + member.Pokemon.name + " \n";
				res.send(replyMessage);
			} else {
				res.send("You don't have a " + Utilities.numeral_suffix(position) + " party member!");
			}

		});
	}

	function getPartyRoster(res){

		Pokemon_Instance.findAll({
			attributes: ['party_position', 'Pokemon.name'],
			order: [['party_position', 'ASC']],
			where: {
				owner_id: String(res.message.user.id)
			},
			include: [
				{model: Pokemon}
			]
		})
		.then(function(party_members){
			if(party_members.length > 0){
				var replyMessage = "Your current party members are: \n";
				party_members.map(function(member){
					replyMessage += Utilities.numeral_suffix(member.party_position)+ ":\t:" + member.Pokemon.name.toLowerCase() + ": " + member.Pokemon.name + " \n";
				});
				res.send(replyMessage);
			} else {
				res.send("You don't own any pokemon!");
			}
		});
	}
};