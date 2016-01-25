var path = require('path');
var fs = require('fs');

console.log('** API initialize...');

var api = {};

//	Read and initialize api modules
fs.readdirSync(__dirname).filter(function(file){
	return (file.indexOf(".") !== 0) && (file !== "index.js");
}).map(function(file){
	api[file.split('.')[0]] = require(path.join(__dirname, file));
	api[file.split('.')[0]].api = api;
});

//	Make circular references for handlers to call each other

console.log('==============================');
for (var handler in api){
	console.log(handler);
	console.log('------------------------------');
	console.log(api[handler]);
	console.log('------------------------------');
console.log('==============================');
}

console.log('** API methods:');
console.log(api);

module.exports = api;