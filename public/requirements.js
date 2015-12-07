require.config({
	paths: {
		//	Main dependencies
		"jquery": 'libs/jquery-2.1.4.min',
		"underscore": 'libs/underscore-1.8.3.min',
		"backbone": 'libs/backbone-1.2.3.min',
		"socketio": 'libs/socket.io-1.3.7',
		//	RequireJS plugins
		"require-text": 'libs/require-text-2.0.14',
		"dom-ready": 'libs/domReady-2.0.1',
		//	Foundation
		"foundation": 'libs/foundation-6.0.5.min',
		"what-input": 'libs/what-input-1.1.3.min'

	},
	shim: {
		'socketio': {
			exports: 'io'
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: [
			'underscore',
			'jquery'
			],
			exports: 'Backbone'
		}
	},
});

require([

  // Load our app module and pass it to our definition function
  'init',
  ], function(init){
  	console.log('Require configuration set...');
  // The "app" dependency is passed in as "App"
  init.initialize();
});