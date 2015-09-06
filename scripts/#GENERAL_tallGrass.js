//	Description:
//	Tell oak to DM you
//
//	Dependencies:
//	None
//
//	Configuration:
//	None
//
//	Commands:
//	hubot tall grass      - spawn a wild pokemon
//
//	Author:
//	Andrew Studnicky

var options = {
	token: process.env.HUBOT_SLACK_TOKEN,
};

module.exports = function tallGrass(robot) {

	//	Define required modules
	var Sequelize = require('sequelize');

	//	Define required data models
	var Models = require('./models'),
		User = Models.User,
		Pokemon = Models.Pokemon,
		Pokemon_Instance = Models.Pokemon_Instance;

	//	Initialize with wild pokemon spawning disabled
	var wild = false;

	//	Leave this command in as restricted for admins once middleware is in place
	robot.respond(/((tall\s*grass)(.*))$/i, {id: 'admin.tallGrass'}, function (res) {
		var rarity = res.match[3].trim() || "";	//	Third capture group is the important part

		switch (true) {
			case (rarity == "stop"):		//	Turn off wild pokemon spawning
				wild = false;
				res.send('Wild pokemon spawning stopped.');
				break;
			case (rarity == "start"):		//	Turn on wild pokemon spawning
				wild = true;
				res.send('Wild pokemon spawning started.');
				break;
			case (parseInt(rarity) >= 0 && parseInt(rarity) <= 255):	//	Force a pokemon spawn with a specified rarity rating
				wildPokemon(rarity);
				break;
			default:
				res.send('Spawn a random wild pokemon with a rarity index between 0 _(Common)_ and 255 _(Legendary)_.');
		}

	});

	//	Recursive self-executing function! Neat! Start spawning wild pokemon!
	(function tallGrassLoop(){
		setTimeout(function(){
			if (wild === true) {
				wildPokemon(setRarity());
			}
			tallGrassLoop();
		}, setTimer());
	})();

	//	Randomize timer between 6 and 12 minutes...
	function setTimer(){
		//	TODO:: Rewrite as appropriate logarithmic function of user count (promise API return)
		return Math.floor(Math.random() * 360000 + 360000 );
	}

	//	Set a rarity rating for random pokemon.
	function setRarity(){
		//	TODO:: Rewrite as appropriate logarithmic function of user count (promise API return)
		return Math.floor(Math.random() * 254 + 1 );
	}

	function getUserCount(){
		//	Get full user profiles with presence info option
		robot.http("https://slack.com/api/users.list?token=" + options.token + "&presence=1").get()(function(error, reponse, body){
			data = JSON.parse(body);

			if (data.ok !== true){
				console.log('Failed to retrieve users from slack API\n' + error);
				return 0;	//	Do not modify timer if failed
			} else {
				var active_count = 0;

				//	Find present users
				data.members.map(function(o){
					if (o.presence == 'active' && o.is_bot === false){
						active_count++;
					}});
				return active_count;
			}
		});
	}

	function wildPokemon(rarity){

		Pokemon.findOne({
			where:{
				is_wild: true,
				catch_rate: {$gte: (255-rarity)},	//	Invert for UX clarity (rarity as ascending numbers instead of descending)
			},
			order: [
			Sequelize.fn('RANDOM')
			]
		})
		.then(function(pokemon){
			if(pokemon){

				console.log(pokemon.get({plain:true}));

				var pokemon_instance = Pokemon_Instance.build({
						caught_by: "wild",
						current_form: {},
						effort_values: [{}],
						exp: 100,		//	bigint calc level
						gender: 1,
						happiness: 50,	//	rand range 0-255
						has_pokerus: 0,	//	rand range 1:21845 true
						holds_item: {},
						individual_values: [{}],
						is_shiny: 0,		//	rand range 1:8192 -> true
						nature: {},
						national_id: pokemon.national_id,
						nickname: null,
						owner_id: "wild",
						party_position: 0,
						for_trade: 0,
						been_traded: 0,
						for_sale: 0,
						been_sold: 0
				});

				console.log(pokemon_instance.get({plain: true}));


				//	Specify target room because this script is non-reply invoked
				robot.messageRoom('general', "Wild :" + pokemon.name.toLowerCase() + ": " + pokemon.name + " appeared!");
				//	Set pokemon timeout
				setTimeout(function escape(){
					robot.messageRoom('general', "Too slow! :" + pokemon.name.toLowerCase() + ": " + pokemon.name + " has escaped!");
				}, Math.floor(Math.random()*15000+20000-55*pokemon.speed));	//	Faster pokemon have shorter catch timers! :P


			} else {
				robot.messageRoom('general', "Rarity too low, no pokemon found");
			}

		});

	}

};