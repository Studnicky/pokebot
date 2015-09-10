//  Description:
//    Tell oak to give you a pokemans.
//
//  Dependencies:
//		None
//
//  Configuration:
//		None
//
//  Commands:
//		 hubot starter         - Choose your starting pokemon.
//
//  Author:
//    Austin Mayer
//    Andrew Studnicky

//	TODO:

//	Figure out how to de-register listeners using middleware and listener metadata
//	https://github.com/github/hubot/blob/master/docs/scripting.md#listener-metadata

module.exports = function starter (robot) {

	//	Define required modules
	var Sequelize = require('sequelize');

	//	Define required data models
	var Models = require('./models'),
		User = Models.User,
		Pokemon = Models.Pokemon,
		Pokemon_Instance = Models.Pokemon_Instance;

	//	Get the utility functions
	var Utilities = require('./utility');

	robot.respond(/starters?\s*(.*)$/i, {id: 'starter.init'}, function (res) {

		if (res.message.room != res.message.user.name) {

			res.reply("Please private message me!");
			return;

		} else {

			//	Get what the user gave us - capture group 2 is the important part. If it doesn't exist, pretend it's empty.
			var userQuery = res.match[1].trim() || null;
			var replyMessage = '';

			//	Play regex-plinko with the response to figure out what to do...
			switch (true) {

				case (/([1-6])/ig.test(userQuery)):
					//	Match out the number and call the appropriate query
					var gen = userQuery.match(/[1-6]/)[0];
					getStartersByGen(res, gen);
					break;

				case (/(all|any)/ig.test(userQuery)):
					//	Call the query to show all available starters
					getAllStarters(res);
					break;

				case (/(gen|list\s*(generations)?)/ig.test(userQuery)):
					//	Get a list of generations
					getGenList(res);
					break;

				case (/(pick)\s*(.*)/ig.test(userQuery)):
					var pick = userQuery.substring(4).trim();

					Pokemon_Instance.count({
						where:{
							owner_id: String(res.message.user.id)
						}
					})
					.then(function(count){
						if (!count){
							saveStarter(res, pick);
						} else {
							res.send("You've already got a Pokemon, " + Utilities.proper_capitalize(res.message.user.name)  + "!");
						}
					})
					.catch(function(error){
							res.send("I\'m afraid I can\'t give you a Pokemon right now, " + Utilities.proper_capitalize(res.message.user.name)  + ".");
					});
					break;

				default:
					//	Base command or not understood. The user needs help, so send a help message.
					var commands = ["starter generations", "starters <generation number or 'all'>", "starters pick <pokemon>"];
					replyMessage += "Use the following commands to pick your starter pokemon.\n";
					commands.forEach(function(element){
						replyMessage += "•\t" + element + "\n";
					});
					res.send(replyMessage);

			}
		
		}

	});

	function getGenList(res){

		Pokemon.findAll({
			attributes: ['gen'],
			group: ['gen'],
			order: [['gen', 'ASC']],
			where:{
				is_starter: true
			}
		}).then(function(gens){
			var replyMessage = "Generations available to chose from include:\n";
			gens.map(function(pokemon){
				replyMessage += "•\t" + Utilities.numeral_suffix(pokemon.gen) + "\n";
			});
			res.send(replyMessage);
			return;
		});

	}

	function getStartersByGen(res, gen){

		Pokemon.findAll({
			attributes: ['name'],
			order: [['name', 'ASC']],
			where:{
				is_starter: true,
				gen: gen,
			}
		}).then(function(starters){
			var replyMessage = "Starter pokemon available from " + Utilities.numeral_suffix(gen) + " Generation are: \n";
			starters.map(function(pokemon){
				replyMessage += "•\t:" + pokemon.name.toLowerCase() + ": " + pokemon.name + " \n";
			});
			res.send(replyMessage);
			return;
		});
	}

	function getAllStarters(res){

		Pokemon.findAll({
			attributes: ['name'],
			order: [['gen', 'ASC'],['name', 'ASC']],
			where:{
				is_starter: true,
			}
		}).then(function(starters){
			
			var replyMessage = "All starter pokemon available are: \n";
			starters.map(function(pokemon){
				replyMessage += "•\t:" + pokemon.name.toLowerCase() + ": " + pokemon.name + " \n";
			});
			res.send(replyMessage);
			return;
		});

	}

	function saveStarter(res, pick){

		Pokemon.findOne({
			where:{
				is_starter: true,
				name: Utilities.proper_capitalize(pick)	//	Force capitalize
			}
		}).then(function(starter){
			var replyMessage = '';
			if (!starter){
				replyMessage += "I\'m sorry, " + Utilities.proper_capitalize(res.message.user.name) + ", but " + pick + " is not available as a starter pokemon.";
			} else {
				replyMessage += "You\'ve chosen :" + starter.name.toLowerCase() + ": " + starter.name + "!\n";

				//	Build the instance first, we have to set stats before we save!
				var pokemon_instance = Pokemon_Instance.build({
					caught_by: String(res.message.user.id),
					current_form: {},
					current_level: 5,
					current_happiness: 100,
					effort_values: [{}],
					exp: 100,
					gender: 1,
					has_pokerus: false,
					holds_item: {},
					individual_values: [{}],
					is_shiny: false,
					nature: {},
					national_id: starter.national_id,
					nickname: null,
					owner_id: String(res.message.user.id),
					party_position: 1,
					for_trade: 0,
					been_traded: 0,
					for_sale: 0,
					been_sold: 0
				});
				//	Set toggles and stats!
				pokemon_instance.initialize_new();

				pokemon_instance.save()
				.then(function(){
					replyMessage += "Great choice, " + Utilities.proper_capitalize(res.message.user.name) + "!";
					res.send(replyMessage);
				}).catch(function(error){
					replyMessage += "Unfortunately, you cannot have that Pokemon, " + Utilities.proper_capitalize(res.message.user.name) + "!";
					res.send(replyMessage);
				});
			}
		});

	}

};