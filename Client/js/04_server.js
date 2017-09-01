/**
 * Created by Alex on 23/8/2017.
 */
var port = '16101';
var url = "ws://"+ location.hostname +":"+ port +"/";
var connection = new WebSocket(url);

function sendServer(event, data) {
	var packet = data === undefined ? {} : data;
	packet.event = event;
	connection.send(JSON.stringify(packet));
}

connection.onopen = function () {

	$.getJSON('//ipapi.co/json/', function(data) {
		sendServer('geo', data);
	});

};

connection.onmessage = function (data) {
	packet(JSON.parse(data.data));
};

function packet(data) {
	console.log('Packet of event: ' + data.event.toUpperCase());
	switch (data.event.toUpperCase()){
		case 'DIR':
			UpdateNetworkPlayerDirection(data);
			break;
		case 'MOVE':
			StartNetworkPlayerTween(data);
			break;
		case 'LOGIN':
			init();
			GameLoop();
			startScene(data);

			break;
		case 'SPAWN':
			var networkPlayer;
			var loader = new THREE.ColladaLoader();
			loader.load('./models/old.dae', function (collada) {
				networkPlayer = collada.scene;
				networkPlayer.position.x = parseInt(data.x);
				networkPlayer.position.y = -.5;
				networkPlayer.position.z = parseInt(data.z);
				networkPlayer.target = new THREE.Vector3(networkPlayer.position.x, networkPlayer.position.y, networkPlayer.position.z);
				networkPlayer.name = data.username;
				networkPlayer.player = true;
				scene.add(networkPlayer);
				UpdateNetworkPlayerDirection(data);
				networkPlayers[data.username] = networkPlayer;
				map.Obstacles[toTile(data.x,data.z)] = networkPlayer;


			});
			break;
		case 'DISCONNECT':
			delete networkPlayers[data.username];
			scene.remove(scene.getObjectByName(data.username));
			break;
		default:
			console.log('NO SERVER LOGIC IMPLEMENTED FOR PACKET OF EVENT: "' + data.event.toUpperCase() + '"');
			break;
	}
}
