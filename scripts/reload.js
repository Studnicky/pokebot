//	Description:
//		Tell oak to reload scripts
//
//	Dependencies:
//		None
//
//	Configuration:
//		None
//
//	Commands:
//		hubot reload          - Reload all scripts (faster testing)
//
//	Author:
//		Andrew Studnicky

var Fs, Path, oldCommands, oldListeners, reloadAllScripts, success;

Fs = require('fs');

Path = require('path');

oldCommands = null;

oldListeners = null;

module.exports = function(robot) {
	robot.hear(/command count/i, function(msg) {
		return msg.send("I am aware of " + msg.robot.commands.length + " commands");
	});
	return robot.respond(/reload/i, function(msg) {
		var error;
		try {
			oldCommands = robot.commands;
			oldListeners = robot.listeners;
			robot.commands = [];
			robot.listeners = [];
			return reloadAllScripts(msg, success, function(err) {
				return msg.send(err);
			});
		} catch (_error) {
			error = _error;
			console.log("Hubot reloader:", error);
			return msg.send("Could not reload all scripts: " + error);
		}
	});
};

success = function(msg) {
	var i, len, listener;
	for (i = 0, len = oldListeners.length; i < len; i++) {
		listener = oldListeners[i];
		listener = {};
	}
	oldListeners = null;
	oldCommands = null;
	return msg.send("Reloaded all scripts");
};

reloadAllScripts = function(msg, success, error) {
	var externalScripts, hubotScripts, robot, scriptsPath;
	robot = msg.robot;
	robot.emit('reload_scripts');
	scriptsPath = Path.resolve(".", "scripts");
	robot.load(scriptsPath);
	scriptsPath = Path.resolve(".", "src", "scripts");
	robot.load(scriptsPath);
	hubotScripts = Path.resolve(".", "hubot-scripts.json");
	Fs.exists(hubotScripts, function(exists) {
		if (exists) {
			return Fs.readFile(hubotScripts, function(err, data) {
				var scripts;
				if (data.length > 0) {
					try {
						scripts = JSON.parse(data);
						scriptsPath = Path.resolve("node_modules", "hubot-scripts", "src", "scripts");
						return robot.loadHubotScripts(scriptsPath, scripts);
					} catch (_error) {
						err = _error;
						error("Error parsing JSON data from hubot-scripts.json: " + err);
					}
				}
			});
		}
	});
	externalScripts = Path.resolve(".", "external-scripts.json");
	Fs.exists(externalScripts, function(exists) {
		if (exists) {
			return Fs.readFile(externalScripts, function(err, data) {
				var scripts;
				if (data.length > 0) {
					try {
						scripts = JSON.parse(data);
					} catch (_error) {
						err = _error;
						error("Error parsing JSON data from external-scripts.json: " + err);
					}
					robot.loadExternalScripts(scripts);
				}
			});
		}
	});
	return success(msg);
};