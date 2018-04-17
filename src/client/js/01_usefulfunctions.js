/**
 * Created by Alex on 20/8/2017.
 */

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Lerp(a, b, t) {
	return a + t * (b - a);
}

function range(start, stop, step) {
	if (typeof stop === 'undefined') {
		stop = start;
		start = 0;
	}

	if (typeof step === 'undefined') {
		step = 1;
	}

	if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
		return [];
	}

	var result = [];
	for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
		result.push(i);
	}

	return result;
}

/**@returns {number}*/
function Clamp(val, min, max) {
	return Math.max(min,Math.min(max,val));
}


function toScreenXY( position, camera, jqdiv ) {

	var pos = position.clone();
	projScreenMat = new THREE.Matrix4();
	projScreenMat.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
	projScreenMat.multiplyVector3( pos );

	return { x: ( pos.x + 1 ) * jqdiv.width() / 2 + jqdiv.offset().left,
		y: ( - pos.y + 1) * jqdiv.height() / 2 + jqdiv.offset().top };

}