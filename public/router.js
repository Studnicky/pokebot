define([
	//	Views files
	'views/main-view',
	'views/topbar-view',
	'views/sidebar-view'
], function(MainView, TopbarView, SideBarView){
	var MainRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'': 'index',
			'members': 'members',
			'members/:id': 'members_id',
			'pokedex': 'pokedex',
			'pokedex/:id': 'pokedex_id',
			'request': 'request_invite',
			// Default
			'*path': 'unhandled'
		},
		index: function(){
			var topbarView = new TopbarView();
      		topbarView.render();

			var mainView = new MainView();
      		mainView.render();

			var sideBarView = new SideBarView();
      		sideBarView.render();

      		$(document).foundation();
			
			console.log("Route: Index");
		},
		members: function(){
			console.log("Route: Members ");
		},
		members_id: function(id){
			console.log("Route: Members " + id);
		},
		pokedex: function(){
			console.log("Route: Pokedex ");
		},
		pokedex_id: function(id){
			console.log("Route: Pokedex " + id);
		},
		request_invite: function(){
			console.log("Route: Request invite ");
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