define([
	//	View dependencies
	'foundation',
	//	Template load via text plugin
	'require-text!templates/topbar-template.html'
], function(Foundation, TopbarTemplate){
	var TopbarView = Backbone.View.extend({

		el: $("#main-nav"),

		initialize: function(){
		},
		render: function(){
			console.log("Topbar Initialize...");
			var data = {};
			var compiledTemplate = _.template( TopbarTemplate, data );
			this.$el.append( compiledTemplate );
			// this.$el.foundation();

			console.log("Topbar Rendered!");
		},
		events: {
			// "click input[type=button]": "doSearch"
		}
		
	});

	return TopbarView;

});