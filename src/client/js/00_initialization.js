// if(location.hostname !== 'localhost') window.stop();

var xAxis = new THREE.Vector3(1,0,0);
var yAxis = new THREE.Vector3(0,1,0);
var zAxis = new THREE.Vector3(0,0,1);


//DIRECTIONS
var Directions = {
	'Up'				:1,
	'Down'			:0,
	'Left'			:-.5,
	'Right'			:.5,
	'UpLeft'		:-.75,
	'UpRight'		:.75,
	'DownLeft'	:-0.25,
	'DownRight'	:.25
};

//KEYBOARD KEYS
var KeyboardInputs = {

	//MAIN KEYS
	38:'Up',
	40:'Down',
	37:'Left',
	39:'Right',
	103:'UpLeft',
	105:'UpRight',
	97:'DownLeft',
	99:'DownRight',
	17:'Ctrl',

	//ALTERNATIVE
	104:'Up',
	98:'Down',
	100:'Left',
	102:'Right'

};

var pressedKeys = [];

function addKey(key){

	var pressed = KeyboardInputs[key] !== undefined?KeyboardInputs[key]:'';
	if ( pressed === '' ) return;
	//console.log(pressed);
	for (var i = 0; i < pressedKeys.length ; i++){
		if(pressedKeys[i] === pressed) return;
	}
	pressedKeys.splice(0,0,pressed);
}

function removeKey(key){
	var pressed = KeyboardInputs[key] !== undefined?KeyboardInputs[key]:'';
	if ( pressed === '' ) return;
	for (var i = 0; i < pressedKeys.length ; i++){
		if(pressedKeys[i] === pressed) pressedKeys.splice(i,1);
	}
}

