var packet = require('./packet.js');
var shortID = require('shortid');

module.exports = function () {

		var client = this;
		this.isGeoDefined = false;
		this.name = 'UNDEFINED CLIENT NAME';
		this.x = 0;
		this.z = 0;
		this.dir = 'Down';
		this.type = 'player';
		this.playing = false;
		this.currentMap = '';

		this.initiate = function () {

			//LOGIN

			client.name = shortID.generate();
			client.playing = true;
			process.stdout.write('Player "' + client.name + '" is logging in...');
			client.currentMap = 'testarea';
			var freeSpawnSpot = maphandler.freeBetween(client.currentMap, 1, 7, 1, 7);
			client.x = freeSpawnSpot.x;
			client.z = freeSpawnSpot.z;
			maps[client.currentMap].layers.obstacles[maphandler.getTile(client.currentMap,client.x,client.z)] = client;
			maps[client.currentMap].clients.push(client);

			client.send('login', {
				'map': client.currentMap,
				'username': client.name,
				'x': client.x,
				'z': client.z
			});

			client.broadcastRoom('spawn',{
				'username': client.name,
				'x': client.x,
				'z': client.z,
				'dir': client.dir
			});

			client.getUsersInRoom();

			console.log('...' + 'success.');

		};

		this.broadcastRoom = function (event, data) {
			maps[client.currentMap].clients.forEach(function (otherClient) {
				if(otherClient.name !== client.name) otherClient.send(event, data);
			})
		};

	this.getUsersInRoom = function(){
		maps[client.currentMap].clients.forEach(function(otherClient){
			if(otherClient.name !== client.name){
				client.send('spawn',{
					'username': otherClient.name,
					'x': otherClient.x,
					'z': otherClient.z,
					'dir': otherClient.dir
				})
			}
		});
	};
		
		this.send = function (event, data) {
			var packet = data === undefined ? {} : data;
			packet.event = event;
			client.ws.send(JSON.stringify(packet));
		};

		this.open = function () {
			console.log('Client open?');
		};

		this.message = function (data) {
			packet(client, JSON.parse(data));
		};

		this.exitRoom = function(){
			maps[client.currentMap].layers.obstacles[maphandler.getTile(client.currentMap, client.x, client.z)] = 0;
			removeByAttr(maps[client.currentMap].clients,'name', client.name);
			client.broadcastRoom('disconnect',{
				'username':client.name
			})
		};

		this.close = function () {
			if(client.playing){
				client.exitRoom(client.currentMap);
				console.log(client.name + " logged out.");
			}
		}

};