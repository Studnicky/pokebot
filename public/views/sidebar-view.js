define([
	//	Associated models & collections
	'/../models/user-model',
	'/../collections/user-collection',
	//	View dependencies
	'foundation',
	//	Template load via text plugin
	'require-text!templates/sidebar-template.html'
], function(User, Users, Foundation, template){

	var SideBarView = Backbone.View.extend({

		el: $('#main-sidebar'),

		initialize: function(){
			console.log("Sidebar Initialize...");
			this.userModel = new User();
			this.userCollection = new Users();
		},
		render: function(){
			var data = {};

			console.log(this.userCollection);
			//	Can we do this?
			console.log(this.userCollection.each(function(o){
				console.log(o);
			}));

			var compiledTemplate = _.template( template, data );
			this.$el.append( compiledTemplate );
			// this.$el.foundation();

			console.log("Sidebar Rendered!");
		},
		events: {
			// "click input[type=button]": "doSearch"
		}
	});

	return SideBarView;

});