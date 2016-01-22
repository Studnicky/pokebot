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
	proper_capitalize: function(name) {
		return name.charAt(0).toUpperCase() + name.slice(1);
	},

}