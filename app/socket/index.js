var socketio = require('socket.io');
var api = require(__dirname + '/../api');

//	Global ref for socket handler
module.exports.listen = function(app){
	io = socketio.listen(app);

	console.log('** Socket Handler initialize...');
	io.on('connection', function(socket){
		console.log('Socket connected!');
	});

	//	Define namespaces
	user = io.of('/user');
	pokemon = io.of('/pokemon');
	pokedex = io.of('/pokedex');

	// user.on('connection', function(socket){
	// 	console.log('User connected!');

	// 	socket.on('list_users', function(){
	// 		console.log('Get user list');
	// 		api.user.list.get(function(err, response){


	// 			socket.emit('user-list', {data: users});
			

	// 		});
	// 	});

	// });

	return io;
}