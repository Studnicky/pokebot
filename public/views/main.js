define([
	//	View dependencies
	'foundation',
	'socketio',
	//	Template load via text plugin
	'require-text!/../../templates/main/main.html'
], function(Foundation, io, MainTemplate){
	var MainView = Backbone.View.extend({

		el: $('#main-content'),

		initialize: function(){
			// Open socket connection... 
			var connection = io.connect(window.location.hostname);
			connection.on('outgoing', function (data) {
				console.log(data);
				connection.emit('incoming', { incoming: 'sample incoming data' });
			});

			console.log("MainView Initialize...");
		},
		render: function(){
			var data = {};
			var compiledTemplate = _.template( MainTemplate, data );
			this.$el.append( compiledTemplate );
			// this.$el.foundation();

			console.log("MainView Rendered!");
		},
		events: {
			// "click input[type=button]": "doSearch"
		}
	});

	return MainView;

});