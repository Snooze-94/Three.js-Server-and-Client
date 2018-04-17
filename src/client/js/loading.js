var progress = document.createElement('div');
var progressBar = document.createElement('div');

progress.appendChild(progressBar);

document.body.appendChild(progress);

var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {
	progressBar.style.width = (loaded / total * 100) + '%';
};

function addRandomPlaceHoldItImage(){
	var r = Math.round(Math.random() * 4000);
	new THREE.ImageLoader(manager).load('http://placehold.it/' + r + 'x' + r);
}

for(var i = 0; i < 10; i++) addRandomPlaceHoldItImage();