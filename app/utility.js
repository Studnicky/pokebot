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
		//	emoji += (pokemon.has_forms) ? ('-' + pokemon.forms.default) : ('');
		//	We'll worry about forms later, DB && API will have to change when we do
	} else {
		//	emoji += (pokemon.has_gender && instance.is_female) ? ('-f') : ('');
		//	Not all pokemon have gender specific sprites, DB update necessary
		//	emoji += (pokemon.has_forms) ? ('-' + instance.current_form) : ('');
		emoji += (instance.is_shiny ? '-s' : '');
	}
	emoji += ':';
	return ' ' + emoji + ' *' + display_name(pokemon.name) + '*';
}
function display_name (name){	//	Strip data tags to leave display name
	var colortags = new RegExp(/-red|-blue|-orange|-white|-black|-yellow/);
	var formtags = new RegExp(/-east|-west|-rainy|-snowy|-sunny|-attack|-defense|-speed|-plant|-sandy|-trash|-overcast|-sunshine|-fan|-frost|-heat|-mow|-wash|-altered|-origin|-land|-sky|-active|-zen|-spring|-summer|-autumn|-winter|-ordinary|-resolute|-aria|-pirouette|-icy|-archipelago|-continental|-elegant|-garden|-highplains|-jungle|-marine|-meadow|-modern|-monsoon|-ocean|-polar|-river|-sandstorm|-savannah|-sun|-tundra|-eternal|-blade|-shield|-neutral|-active/);
	var typetags = new RegExp(/-normal|-fire|-water|-electric|-grass|-ice|-fighting|-poison|-ground|-flying|-psychic|-bug|-rock|-ghost|-dragon|-dark|-steel|-fairy/);
	var sizetags = new RegExp(/-small|-average|-large|-super/);
	var spritetags = new RegExp(/-f|-m|-s|-b|-x|-y/);
	//	Always capitalize first letter before swapping string...
	name = proper_capitalize(name);
	//	Special rules for legendary and mega sprites & names...
	name = name.replace(/(.*)(-incarnate)/, '$1 Incarnate');
	name = name.replace(/(.*)(-therian)/, 'Therian $1');
	name = name.replace(/(.*)(-confined)/, '$1');
	name = name.replace(/(.*)(-unbound)/, '$1 Unbound');
	name = name.replace(/(.*)(-primal)/, 'Primal $1');
	name = name.replace(/(.*)(-mega)/, 'Mega $1');
	//	None of these should show...
	name = name.replace(colortags, '');
	name = name.replace(formtags, '');
	name = name.replace(typetags, '');
	name = name.replace(sizetags, '');
	name = name.replace(spritetags, '');
	return name;
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
	display_name:display_name,
	get_box:get_box,
	get_box_position:get_box_position
}

module.exports = utility;