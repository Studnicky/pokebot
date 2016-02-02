function numeral_suffix (num) {	//Add suffixes to number
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
}

function proper_capitalize (string) {	//	Captialize first letter of a string
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function pokemon_emoji (pokemon, instance){	//	Make slack emoji
	var emoji = ':' + pokemon.name.toLowerCase();
	if(!instance){
		// emoji += (pokemon.has_forms) ? ('-' + pokemon.forms.default) : ('');
	} else {
		emoji += (pokemon.has_gender && instance.is_female) ? ('-f') : ('');
		emoji += (pokemon.has_forms) ? ('-' + instance.current_form) : ('');
		emoji += (instance.is_shiny) ? ('-s') : ('');
	}
	emoji += ':';
	return ' ' + emoji + ' *' + proper_capitalize(pokemon.name) + '*';
}
function get_box (position){	//	Find box from position
	return parseInt(Math.floor((position+30-7)/30));
}
function get_box_position (position){	//	Find position inside box from position
	return parseInt(((position-6)%30) == 0 ? 30 : ((position-6)%30));
}


var utility = {
	numeral_suffix:numeral_suffix,
	proper_capitalize:proper_capitalize,
	pokemon_emoji:pokemon_emoji,
	get_box:get_box,
	get_box_position:get_box_position
}

module.exports = utility;