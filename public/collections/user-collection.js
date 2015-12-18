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
			var socket = io.connect(window.location.hostname + ":3000");
			//	Tell the server we want some data...
			socket.emit('get-user-presence', {incoming: 'get-user-presence'});
			//	When we get the data back...
			socket.on('return-user-presence', function (data) {
				this.process_data(data);
			}.bind(this));
		},
		process_data: function(data){
			// console.log(data);
			data.outgoing.map(function(o){
				this.add(new User(o));
			}.bind(this));
		}
	});

	return Users;

});