define([
	//	Socket
	'socketio',
	//	Main dependencies
	'jquery',
	'underscore',
	'backbone',
	//	View dependencies
	'foundation',
	//	Template load via text plugin
	'require-text!/../../templates/main/main.html'
], function(io, $, _, Backbone, Foundation, MainTemplate){

	var connection = io.connect('http://localhost:3000');
	connection.on('outgoing', function (data) {
		console.log(data);
		connection.emit('incoming', { incoming: 'sample incoming data' });
	});

	var MainView = Backbone.View.extend({

		el: $('#main-content'),

		initialize: function(){
			// Open socket connection...
			console.log("MainView Initialize...");
		},
		render: function(){
			var data = {};
			var compiledTemplate = _.template( MainTemplate, data );
			this.$el.append( compiledTemplate );
			console.log("MainView Rendered!");
		},
		events: {
			// "click input[type=button]": "doSearch"
		}
	
});

	return MainView;

});