define([
	//	View dependencies
	'foundation',
	//	Template load via text plugin
	'require-text!templates/main-template.html'
], function(Foundation, MainTemplate){
	var MainView = Backbone.View.extend({

		el: $('#main-content'),

		initialize: function(){

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