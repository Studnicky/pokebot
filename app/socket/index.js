var socketio = require('socket.io');
var db = require(__dirname + '/../db');
var slack = require(__dirname + '/../slack');

//	Global ref for socket handler
module.exports.listen = function(app){
	io = socketio.listen(app);

		console.log('Socket Handler initialize...');
		io.on('connection', function(socket){
			console.log('Socket connected!');
		});

		//	Define namespaces
		user = io.of('/user');
		pokemon = io.of('/pokemon');
		pokedex = io.of('/pokedex');

		user.on('connection', function(user_socket){
			console.log('User connected!');

			user_socket.on('get-presence', function(){
				console.log('Get user presence');
				slack.web.user.list.presence(function(users){
					//	Any preprocessing of data...
					user_socket.emit('user-presence', {data: users});
				});
			});

			user_socket.on('get-list', function(){
				console.log('Get user list');
				db.user.list.get(function(users){
					//	Any preprocessing of data...
					user_socket.emit('user-list', {data: users});
				});
			});

		});

		return io;
};