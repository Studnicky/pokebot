define([
	'router'
],	function(Router){

	var initialize = function(){
		console.log('Initalizing router...');
		Router.initialize();
	}

	return {
		initialize: initialize
	};
});