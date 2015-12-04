// Filename: router.js
define(
[
	'jquery',
	'underscore',
	'backbone'
],
function($, _, Backbone){
	var MainRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'': 'index',
			'/users': 'users',
			// Default
			'*path': '404'
		},

		index: function(){
			$('#content').append("Index route has been called.");
		}

	});

	var initialize = function(){
		//	Instantiate router object
		var main_router = new MainRouter;

		console.log('Router initialized');

		//	Define route controllers
		main_router.on('index', function(){
			$('#content').append("Index route has been called.");
		});

		main_router.on('404', function(path){
			console.log('Invalid: ', path);
		});

		Backbone.history.start();
	};

	return {
		initialize: initialize
	};
});