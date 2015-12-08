define([
	//	View dependencies
	'foundation',
	//	Template load via text plugin
	'require-text!/../../templates/main/main.html'
], function(Foundation, MainTemplate){
	var MainView = Backbone.View.extend({

		el: $('#main-content'),

		initialize: function(){
			// Open socket connection... ...errors out (io not defined)
			// var connection = io.connect('http://localhost:3000');
			// connection.on('outgoing', function (data) {
			// 	console.log(data);
			// 	connection.emit('incoming', { incoming: 'sample incoming data' });
			// });


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