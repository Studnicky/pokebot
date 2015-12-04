require.config({
	paths: {
		"jquery": '/scripts/libs/jquery-2.1.4.min',
		"underscore": '/scripts/libs/underscore-1.8.3.min',
		"backbone": '/scripts/libs/backbone-1.2.3.min',
		"socketio": '/scripts/libs/socket.io-1.3.7.js',
		"require-text": 'require-text-2.0.14.js'
	}
});

require([

  // Load our app module and pass it to our definition function
  'init',
  ], function(init){

	console.log('Configuration set');

  // The "app" dependency is passed in as "App"
  init.initialize();
});



	console.log('Hi');