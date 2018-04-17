const WEB_SERVER_PORT = 8080;
const GAME_SERVER_PORT = 16101;
const fs = require('fs');
const WebSocket = require('ws');
var connect = require('connect');
var serveStatic = require('serve-static');

connect().use(serveStatic(__dirname + "/client/")).listen(WEB_SERVER_PORT, function(){
    console.log('Server running on 8080...');
});

//LOAD INIT FILES
var init_files = fs.readdirSync(__dirname + "/Initializers");
init_files.forEach(function (initFile) {
	console.log("Loading initializer: "+ initFile);
	require(__dirname + "/Initializers/" + initFile);
});

//LOAD MAPS
console.log('Loading maps...');

maps = {};

var map_files = fs.readdirSync('client/js/maps');
map_files.forEach(function (mapFile) {

	var mapName = mapFile.substr(0,mapFile.indexOf('.'));

	process.stdout.write('Loading map ' + mapName + '...');

	var mapString = fs.readFileSync('client/js/maps/' + mapFile);
	var mapJSON = JSON.parse(mapString);

	process.stdout.write('.');

	var map = {
		'name': mapFile.substr(0,mapFile.indexOf('.')),
		'width': mapJSON.width,
		'height': mapJSON.height,
		'layers':{
			'static': Array.apply(null, new Array(mapJSON.height * mapJSON.width)).map(Number.prototype.valueOf,0),
			'obstacles': Array.apply(null, new Array(mapJSON.height * mapJSON.width)).map(Number.prototype.valueOf,0)
		},
		'clients': []

	};

	process.stdout.write('.');

	for( var layer in mapJSON.layers ){
		if(mapJSON.layers.hasOwnProperty(layer)){
			if(mapJSON.layers[layer].name !== 'Wall') continue;
			for( var x in mapJSON.layers[layer].data ){
				if(mapJSON.layers[layer].data.hasOwnProperty(x)){
					if( mapJSON.layers[layer].data[x] !== 0 ) map.layers.static[x] = 1;
				}
			}
		}
	}

	process.stdout.write('.');

	maps[map.name] = map;

	console.log(new Array(20 - mapName.length).join(".") + ' ' + (((map_files.indexOf(mapFile) + 1) * 100) / map_files.length) + '%');


	console.log('Map ' + mapName + ' loaded.');

});

console.log('All maps loaded.');

//START SERVER
const wss = new WebSocket.Server({ port: GAME_SERVER_PORT });

var clients = [];

wss.on('connection', function connection(ws) {

	console.log(ws);

	var ip = ws._socket.remoteAddress;

	console.log('Client connected from ' + ip.substr(ip.lastIndexOf(':') + 1));

	var c_inst = require('./client.js');
	var thisClient = new c_inst();
	clients.push(thisClient);
	thisClient.ws = ws;

	thisClient.initiate();

	ws.on('open', function () {
		thisClient.open();
	});

	ws.on('message', function (data) {
		thisClient.message(data);
	});

	ws.on('close', function () {
		thisClient.close();
	});

});

console.log('Running on port: ' + WEB_SERVER_PORT);
