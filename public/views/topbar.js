define([
	//	Main dependencies
	'jquery',
	'underscore',
	'backbone',
	//	View dependencies
	'foundation',
	//	Template load via text plugin
	'require-text!/../../templates/main/topbar.html'
], function($, _, Backbone, Foundation, TopbarTemplate){
	var TopbarView = Backbone.View.extend({

		el: $('#main-nav'),

		initialize: function(){
			console.log("Topbar Initialize...");
		},
		render: function(){
			var data = {};
			var compiledTemplate = _.template( TopbarTemplate, data );
			this.$el.append( compiledTemplate );
			console.log("Topbar Rendered!");
		},
		events: {
			// "click input[type=button]": "doSearch"
		}
		
	});

	return TopbarView;

});