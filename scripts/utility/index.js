//	Description:
//		A junk-drawer collection of general utility functions
//
//	Dependencies:
//		None
//
//	Configuration:
//		None
//
//	Commands:
//		None
//
//	Author:
//		Andrew Studnicky

module.exports = {


	//	Helper function to suffix display numbers
	numeral_suffix: function(num) {
		var j = num % 10,
			k = num % 100;

		switch(true){
			case (j == 1 && k != 11):
				return num + "st";
			case (j == 2 && k != 12):
				return num + "nd";
			case (j == 3 && k != 13):
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