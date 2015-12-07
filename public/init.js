define([
	'jquery',
	'underscore',
	'backbone',
	'router'
],	function($, _, Backbone, Router){

	var initialize = function(){
		console.log('Initalizing router...');
		Router.initialize();
	}

	return {
		initialize: initialize
	};
});