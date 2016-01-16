//	Global ref for socket handler
socketHandler = {
	io: null,
	initialize: function(io){
		this.io = io;	//	Local io ref
		console.log('Socket Handler initialize...');
		this.connect();
	},

	connect: function(){

		this.io.on('connection', function(socket) {
			console.log('Socket connected!');
			this.dispatch_events(socket);
		}.bind(this));

	},

	dispatch_events: function(socket){
		pokedex: {
			pokemon: {
				get: socket.on('incoming-pokedex-pokemon', function(data){
					console.log(data);
				});
				emit: socket.emit('outgoing-pokedex-pokemon', {data: ''})
			}
		}
		user: {
			list: {
				get: socket.on('incoming-user-list', function(data){
					console.log(data);
				});
				emit: socket.emit('outgoing-user-list', {data: ''})
			}
			presence: {
				get: socket.on('incoming-user-presence', function(data){
					console.log(data);
				});
				emit: socket.emit('outgoing-user-presence', {data: ''})
			}
			info: {
				get: socket.on('incoming-user-info', function(data){
					console.log(data);
				});
				emit: socket.emit('outgoing-user-info', {data: ''})
			}
			party: {
				get: socket.on('incoming-user-party', function(data){
					console.log(data);
				});
				emit: socket.emit('outgoing-user-party', {data: ''})
			}
			pokemon: {
				get: socket.on('incoming-user-pokemon', function(data){
					console.log(data);
				});
				emit: socket.emit('outgoing-user-pokemon', {data: ''})
			}
		}
	}
};

module.exports = socketHandler;