var socketio = require('socket.io');
var db = require(__dirname + '/../db');

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
				db.user.list.get(function(users){
					//	Any preprocessing of data...
					user_socket.emit('user-list', {data: users});
				});
			});

		});

		// pokedex: {
		// 	pokemon: {
		// 		get: socket.on('incoming-pokedex-pokemon', function(data){
		// 			console.log(data);
		// 		});
		// 		emit: socket.emit('outgoing-pokedex-pokemon', {data: ''})
		// 	}
		// }
		// user: {
		// 	list: {
		// 		get: socket.on('incoming-user-list', function(data){
		// 			console.log(data);
		// 		});
		// 		emit: socket.emit('outgoing-user-list', {data: ''})
		// 	}
		// 	presence: {
		// 		get: socket.on('incoming-user-presence', function(data){
		// 			var userlist = db.user.list.get(function(userlist){return userlist;});
		// 		});
		// 		emit: socket.emit('outgoing-user-presence', {data: ''})
		// 	}
		// 	info: {
		// 		get: socket.on('incoming-user-info', function(data){
		// 			console.log(data);
		// 		});
		// 		emit: socket.emit('outgoing-user-info', {data: ''})
		// 	}
		// 	party: {
		// 		get: socket.on('incoming-user-party', function(data){
		// 			console.log(data);
		// 		});
		// 		emit: socket.emit('outgoing-user-party', {data: ''})
		// 	}
		// 	pokemon: {
		// 		get: socket.on('incoming-user-pokemon', function(data){
		// 			console.log(data);
		// 		});
		// 		emit: socket.emit('outgoing-user-pokemon', {data: ''})
		// 	}
		// }

		return io;
};