module.exports = {

	//	Helper function to suffix display numbers
	numeral_suffix: function(num) {
		var dec = num % 10,
			cent = num % 100;

		switch(true){
			case (dec == 1 && cent != 11):
				return num + "st";
			case (dec == 2 && cent != 12):
				return num + "nd";
			case (dec == 3 && cent != 13):
				return num + "rd";
			default:
				return num + "th";
		}
	},

	//	Helper function to capitalize first letter of a proper name
	proper_capitalize: function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	pokemon_emoji: function(pokemon, instance){
		return ' :' + pokemon.name.toLowerCase() + (instance.is_shiny ? '-shiny' : '') + ': *' + pokemon.name + '*';
	},
	get_box: function(position){
		return parseInt(Math.floor((position+30-7)/30));
	},
	get_box_position: function(position){
		return parseInt(((position-6)%30) == 0 ? 30 : ((position-6)%30));
	},

}