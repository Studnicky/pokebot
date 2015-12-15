define([
	//	View dependencies
	'foundation',
	'socketio',
	//	Template load via text plugin
	'require-text!templates/main-template.html'
], function(Foundation, io, MainTemplate){
	var MainView = Backbone.View.extend({

		el: $('#main-content'),

		initialize: function(){
			// Open socket connection... 
			var socket = io.connect(window.location.hostname + ":3000");
			console.log('Socket connected!');
			socket.emit('ping-incoming', {incoming: 'Ping!'});

			socket.on('ping-outgoing', function (data) {
				console.log(data);
			});
		},
		render: function(){
			console.log("MainView Initialize...");
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