

window.addEventListener("keydown", function(e) {
	// space and arrow keys
	if([37, 38, 39, 40, 17, 103, 105, 97, 99, 104, 98, 100, 101, 102].indexOf(e.keyCode) > -1) {
		e.preventDefault();
	}
}, false);

function updateCameraPosition() {
	camera.distance = Clamp(camera.distance,0,4);
	camera.target = (camera.getWorldDirection().multiplyScalar(-camera.distance));
	camera.target.x += player.position.x;
	camera.target.z += player.position.z + 1;
	camera.target.y += 0.75;

	camera.position.z = Lerp(camera.position.z, camera.target.z, 0.1);
	camera.position.x = Lerp(camera.position.x, camera.target.x, 0.1);
	camera.position.y = Lerp(camera.position.y, camera.target.y, 0.1);
}

function updatePlayerPosition(target) {
	var roundedX = Math.abs(Number((player.position.x % 1).toFixed(5)));
	var roundedZ = Math.abs(Number((player.position.z % 1).toFixed(5)));

	if (roundedX > 0.5) roundedX = Math.abs(roundedX - 1);
	if (roundedZ > 0.5) roundedZ = Math.abs(roundedZ - 1);

	player.position.y = -.5 + (((roundedX>roundedZ)?roundedX:roundedZ)/2);

	player.position.z = target.z;
	player.position.x = target.x;
}

function init(){

	var width = 960;
	var height = 570;

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
	loading = new THREE.LoadingManager(function () {

	});
	clock = new THREE.Clock();
	moveDelay = 1;
	tick = 0;
	framerate = 0;
	targetFPS = 60;
	blocked = [0,0,0,0,0,0,0,0];
	opacityWalls = [];
	networkPlayers = {};

	stats = new Stats();
	stats.dom.id = 'stats';
	document.getElementById('game').appendChild(stats.dom);

	camera = new THREE.PerspectiveCamera(90, 16 / 9, 0.001, 100);
	camera.target = new THREE.Vector3(4,-.5,4);
	camera.position.x = camera.target.x;
	camera.position.z = camera.target.z;
	camera.position.y = camera.target.y;
	camera.distance = 2;
	camera.rotation.x = -0.75;


	renderer = new THREE.WebGLRenderer({
		// antialias: true,
		// alpha: true
	});

	renderer.setClearColor(scene.fog.color);
	renderer.setSize(960, 570);
	document.getElementById('game').appendChild(renderer.domElement);
	document.addEventListener("keydown", keydown, false);
	document.addEventListener("keyup", keyup, false);

}

function keydown(event){
	addKey(event.keyCode);
	if(event.keyCode === 109) camera.distance += 1;
	if(event.keyCode === 107) camera.distance -= 1;
}

function keyup(event) {
	removeKey(event.keyCode);
}

function startScene(data){

	LoadMap(data.map);


	var ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
	scene.add( ambientLight );

	// collada

	var loader = new THREE.ColladaLoader();
	loader.load('./models/old.dae', function (collada) {
		player = collada.scene;
		player.position.x = parseInt(data.x);
		player.position.y = -.5;
		player.position.z = parseInt(data.z);
		player.target = new THREE.Vector3(player.position.x, player.position.y, player.position.z);
		player.name = 'Player';
		player.username = data.username;
		scene.add(player);
		camera.target.x = camera.position.x = player.position.x;
		camera.target.y = camera.position.y = player.position.y;
		camera.target.z = camera.position.z = player.position.z;



	});

}

function PlayerCollision() {

	for(var i = 0; i < blocked.length; i++){

		var check = toTile(player.target.x, player.target.z);

		switch (i){
			case 0:
				check += -map.width - 1;
				break;
			case 1:
				check += -map.width;
				break;
			case 2:
				check += -map.width + 1;
				break;
			case 3:
				check += -1;
				break;
			case 4:
				check += 1;
				break;
			case 5:
				check += map.width - 1;
				break;
			case 6:
				check += map.width;
				break;
			case 7:
				check += map.width + 1;
				break;
		}

		if(i===6){
			switch (blocked[i]){
				case 0:
					if(map.Obstacles[check] === 0)break;
					if(map.Obstacles[check].player !== undefined) break;

					pX = map.Obstacles[check+1];
					nX = map.Obstacles[check-1];

					if(pX !== 0 && !(opacityWalls.indexOf(pX) >= 0) && blocked[4] === 0){
						pX.material.opacity = 0.5;
						opacityWalls.push(pX);
					}

					if(nX !== 0 && !(opacityWalls.indexOf(nX) >= 0) && blocked[3] === 0){
						nX.material.opacity = 0.5;
						opacityWalls.push(nX);
					}

					if( !(opacityWalls.indexOf(map.Obstacles[check]) >= 0) ){
						map.Obstacles[check].material.opacity = 0.5;
						opacityWalls.push(map.Obstacles[check]);
					}

					break;

				default:
					if(map.Obstacles[check] === 0){
						for(var g = 0; g < opacityWalls.length; g++){
							opacityWalls[g].material.opacity = 1;
						}
						opacityWalls = [];
						break;
					}

					if(map.Obstacles[check].player !== undefined) break;

					for(var f = 0; f < opacityWalls.length; f++){
						opacityWalls[f].material.opacity = 1;
					}
					opacityWalls = [];

					pX = map.Obstacles[check+1];
					nX = map.Obstacles[check-1];

					if(pX !== 0 && !(opacityWalls.indexOf(pX) >= 0) && blocked[4] === 0){
						pX.material.opacity = 0.5;
						opacityWalls.push(pX);
					}

					if(nX !== 0 && !(opacityWalls.indexOf(nX) >= 0) && blocked[3] === 0){
						nX.material.opacity = 0.5;
						opacityWalls.push(nX);
					}

					if( !(opacityWalls.indexOf(map.Obstacles[check]) >= 0) ){
						map.Obstacles[check].material.opacity = 0.5;
						opacityWalls.push(map.Obstacles[check]);
					}


					break;
			}
		}

		blocked[i] = map.Obstacles[check];


	}


}


function Move(dir) {
	if(moveDelay < .2) return;
	if(dir in Directions) sendServer('dir',{'dir':dir});
	UpdatePlayerDirection(dir);

	if(pressedKeys.indexOf('Ctrl')>=0) return;

	switch (dir) {
		case 'Up':
			if(blocked[1]!==0) return;
			player.target.z -= 1;
			break;
		case 'Down':
			if(blocked[6]!==0) return;
			player.target.z += 1;
			break;
		case 'Left':
			if(blocked[3]!==0) return;
			player.target.x -= 1;
			break;
		case 'Right':
			if(blocked[4]!==0) return;
			player.target.x += 1;
			break;
		case 'UpLeft':
			if(blocked[0]!==0) return;
			player.target.z -= 1;
			player.target.x -= 1;
			break;
		case 'UpRight':
			if(blocked[2]!==0) return;
			player.target.z -= 1;
			player.target.x += 1;
			break;
		case 'DownLeft':
			if(blocked[5]!==0) return;
			player.target.z += 1;
			player.target.x -= 1;
			break;
		case 'DownRight':
			if(blocked[7]!==0) return;
			player.target.z += 1;
			player.target.x += 1;
			break;
	}

	sendServer('move',{
		'x':Math.round(player.target.x),
		'z':Math.round(player.target.z)});

	StartPlayerTween();

	moveDelay = 0;
}


function StartNetworkPlayerTween(data) {
	var networkPlayer = scene.getObjectByName(data.username);
	if(networkPlayer === undefined || networkPlayer === null) return;
	// if (Math.abs(data.originalZ - networkPlayer.position.z) >= 1) networkPlayer.position.z = data.originalZ;
	// if (Math.abs(data.originalX - networkPlayer.position.x) >= 1) networkPlayer.position.x = data.originalX;

	map.Obstacles[toTile(Math.round(networkPlayer.position.x),Math.round(networkPlayer.position.z))] = 0;
	map.Obstacles[toTile(data.x,data.z)] = networkPlayer;


	var tween = new TWEEN.Tween(networkPlayer.position).to(new THREE.Vector3(parseInt(data.x),networkPlayer.position.y,parseInt(data.z)),200).easing(TWEEN.Easing.Quadratic.InOut);
	tween.onUpdate(function(){
		updateNetworkPlayerPosition(networkPlayer, networkPlayer.position);
	});
	tween.start();
}

function updateNetworkPlayerPosition(networkPlayer, target) {
	var roundedX = Math.abs(Number((networkPlayer.position.x % 1).toFixed(5)));
	var roundedZ = Math.abs(Number((networkPlayer.position.z % 1).toFixed(5)));

	if (roundedX > 0.5) roundedX = Math.abs(roundedX - 1);
	if (roundedZ > 0.5) roundedZ = Math.abs(roundedZ - 1);

	networkPlayer.position.y = -.5 + (((roundedX>roundedZ)?roundedX:roundedZ)/2);

	networkPlayer.position.z = target.z;
	networkPlayer.position.x = target.x;
}


function StartPlayerTween() {
	var tween = new TWEEN.Tween(player.position).to(player.target,200).easing(TWEEN.Easing.Quadratic.InOut);
	tween.onUpdate(function(){
		updatePlayerPosition(player.position);
	});
	tween.start();
}

function UpdatePlayerDirection(dir){
	if(dir === 'Ctrl') return;
	player.rotation.z = Math.PI * Directions[dir];
}

function UpdateNetworkPlayerDirection(data){
	var networkPlayer = scene.getObjectByName(data.username);
	if(networkPlayer === undefined || networkPlayer === null) return;
	networkPlayer.rotation.z = Math.PI * Directions[data.dir];
}


var scene, camera, clock, renderer, player,
	moveDelay, tick, delta, loading, stats,
	framerate, targetFPS, blocked, opacityWalls,
	networkPlayers, map, playing;
scene = camera = clock = renderer = player =
	moveDelay = tick = delta = loading = stats =
	framerate = targetFPS = blocked = opacityWalls =
	networkPlayers = map = playing = null;

function update() {
	tick += delta;
	moveDelay += delta;

	framerate ++;

	TWEEN.update();



	if(pressedKeys[0] !== undefined) Move(pressedKeys[0]);
	if(player !== undefined && player !== null) {
		PlayerCollision();
		updateCameraPosition();
	}


	stats.update();

}

function GameLoop(){
	delta = clock.getDelta();

	if((framerate > targetFPS) && tick < 0) return;

	if(tick > 1){

		framerate = 0;
		tick = 0;
	}

	// console.log(pressedKeys);

	requestAnimationFrame(GameLoop);

	renderer.render(scene, camera);

	update();
}

