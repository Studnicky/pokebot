define([
	'jquery',
	'underscore',
	'backbone',
	//	Views files
	'views/main',
	'views/topbar'
], function($, _, Backbone, MainView, TopbarView){
	var MainRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'': 'index',
			'pokedex': 'pokedex',
			'pokedex/:id': 'pokedex_id',
			// Default
			'*path': 'unhandled'
		},
		index: function(){
			var topbarView = new TopbarView();
      		topbarView.render();

			var mainView = new MainView();
      		mainView.render();
			
			console.log("Route: Index");
		},
		pokedex: function(){
			console.log("Route: Pokedex ");
		},
		pokedex_id: function(id){
			console.log("Route: Pokedex " + id);
		},
		unhandled: function(){
			console.log("derp");
		}

	});

	var initialize = function(){
		//	Instantiate router object
		var main_router = new MainRouter();
		console.log('Router initialized!');
		Backbone.history.start();
	};

	return {
		initialize: initialize
	};
});