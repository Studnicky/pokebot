var path = require('path');
var fs = require('fs');

console.log('DB wrapper initialize...');
var db = {};
//	Read and initialize database modules
fs.readdirSync(__dirname).filter(function(file){
	return (file.indexOf(".") !== 0) && (file !== "index.js");
}).map(function(file){
	var handler = require(path.join(__dirname, file));
	db[handler.name] = handler.methods;
	db[handler.name].db = db;
});

console.log('** db methods:');
console.log(db);

module.exports = db;