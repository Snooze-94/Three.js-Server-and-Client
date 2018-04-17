/**
 * Created by Alex on 20/8/2017.
 */
var Tiles = {
	1: {
		'Name'		:	'Floor',
		'Obstacle':false,
		'Static':true,
		'Texture' :'textures/tiles/floor.png',
		'TextureH':'textures/tiles/floor.png',
		'TextureV':'textures/tiles/floor.png'

	},
	3: {
		'Name':'Wall',
		'Obstacle':true,
		'Static':true,
		'Texture' :'textures/tiles/wall.png',
		'TextureH':'textures/tiles/wall_h.png',
		'TextureV':'textures/tiles/wall_v.png'
	}
};
//
// function TileMaterial(texH,texV) {
// 	var materials = [];
//
// 	for (var i = 0 ; i < 6 ; i++){
//
// 		var tex;
//
// 		if([2,3].indexOf(i) >= 0){
// 				tex = new THREE.TextureLoader(loading).load(texV);
// 		}else{
// 				tex = new THREE.TextureLoader(loading).load(texH);
// 		}
//
// 		tex.magFilter = THREE.NearestFilter;
// 		tex.minFilter = THREE.NearestMipMapLinearFilter;
// 		tex.wrapS = THREE.RepeatWrapping;
// 		tex.wrapt = THREE.RepeatWrapping;
// 		tex.repeat.set(1,1);
// 		materials.push(new THREE.MeshLambertMaterial({map:tex}));
// 	}
//
// 	return materials;
// }
//
// function TileTexture(tex) {
// 	var texture = new THREE.TextureLoader(loading).load(tex);
// 	texture.magFilter = THREE.NearestFilter;
// 	texture.minFilter = THREE.NearestMipMapLinearFilter;
// 	texture.wrapS = THREE.RepeatWrapping;
// 	texture.wrapt = THREE.RepeatWrapping;
// 	texture.repeat.set(1,1);
// 	return texture;
// }