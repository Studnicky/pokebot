define([
	//	Associated models
	'/../models/user-model',
	//	Model dependencies
	'socketio'
], function(User, io){

	var Users = Backbone.Collection.extend({

		model: User,
		initialize: function(){
			// Open socket connection... 
			var user_socket = io.connect(window.location.hostname + ":3000/user");
			//	Tell the server we want some data...
			user_socket.emit('get-presence');
			//	When we get the data back...
			user_socket.on('user-presence', function (data) {
				this.process_data(data);
			}.bind(this));
		},
		process_data: function(data){
			console.log(data);

		}
	});

	return Users;

});