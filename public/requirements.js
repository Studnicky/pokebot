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
		},
		'foundation': {
			deps: [
				'jquery'
			],
			exports: 'foundation'
		}
	},
});

require([
	//	Require main front-end dependencies in global scope
	'jquery',
	'underscore',
	'backbone',
	'socketio',
	// Load our app module
	'init'
	], function($, _, Backbone, io, init){
		console.log('Require configuration set...');
  		init.initialize();
  });