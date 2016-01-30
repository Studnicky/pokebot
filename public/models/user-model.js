define([
	//	Model dependencies
	'socketio'
	//	Template load via text plugin
], function(io){

	var User = Backbone.Model.extend({
		defaults: {
			slack_id: '',
			slack_name: '',
			tz_offset: null,
			permissions_level: 0,
			position_cap: 0,
			credits: 0		
		},
		initialize: function(){

		},
		validate: function(attrs){

		}
	});

	return User;

});