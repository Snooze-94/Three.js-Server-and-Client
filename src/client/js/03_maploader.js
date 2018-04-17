/**
 * Created by Alex on 20/8/2017.
 */
function toTile(x,z){
	return (z * map.width) + x;
}


function LoadMap(mapName){

	map = {
		'name':mapName,
		'layers':{}
	};

	$.getJSON('js/maps/' + mapName +'.json', function (mapJSON) {
		var width = mapJSON.width;
		var height = mapJSON.layers.length;
		var depth = mapJSON.height;

		map.width = width;
		map.height = height;
		map.depth = depth;
		map.Obstacles = Array.apply(null, new Array(width*depth)).map(Number.prototype.valueOf,0);

		for(var y = 0; y < height; y++){

			map.layers[mapJSON.layers[y].name] = {
				'toBe':'implemented'
			};

			var layerData = mapJSON.layers[y].data;


			for(var x = 0; x < (width * depth); x++){

				var tileNumber = layerData[x];

				if(tileNumber === 0) continue;

				var pxI = x + 1;
				var nxI = x - 1;
				var pzI = x + width;


				var px = pxI % width === 0 ? 0 : layerData[pxI];
				var nx = x % width === 0 ? 0 : layerData[nxI];
				var pz = layerData[pzI] === undefined? 0 : layerData[pzI];


				var posx = x % width;
				var posy = y - 1;
				var posz = Math.floor(x/width);

				var pos = new THREE.Vector3(posx,posy,posz);

				var pyG,pxG,nxG,pzG, GEO;

				GEO = new THREE.Geometry();

				//POSITIVE Y-AXIS FACE

				pyG = new THREE.PlaneBufferGeometry( 1, 1 );

				pyG.attributes.uv.array[ 2 ] = 1/2;
				pyG.attributes.uv.array[ 6 ] = 1/2;
				pyG.attributes.uv.array[ 5 ] = 1/2;
				pyG.attributes.uv.array[ 7 ] = 1/2;

				pyG.rotateX( - Math.PI / 2 );
				pyG.translate( 0, .5, 0 );

				GEO.merge(new THREE.Geometry().fromBufferGeometry(pyG));


				if(y===0) px = nx = pz = 1;


				//POSITIVE X-AXIS FACE


				if(px === 0){
					pxG = new THREE.PlaneBufferGeometry( 1, 1 );

					pxG.attributes.uv.array[ 0 ] = 1/2;
					pxG.attributes.uv.array[ 1 ] = 1;
					pxG.attributes.uv.array[ 2 ] = 1;
					pxG.attributes.uv.array[ 3 ] = 1;
					pxG.attributes.uv.array[ 4 ] = 1/2;
					pxG.attributes.uv.array[ 5 ] = 1/2;
					pxG.attributes.uv.array[ 6 ] = 1;
					pxG.attributes.uv.array[ 7 ] = 1/2;

					pxG.rotateY( Math.PI / 2 );
					pxG.translate( .5, 0, 0 );

					GEO.merge(new THREE.Geometry().fromBufferGeometry(pxG));
				}


				//NEGATUVE X-AXIS FACE


				if(nx === 0){
					nxG = new THREE.PlaneBufferGeometry( 1, 1 );

					nxG.attributes.uv.array[ 0 ] = 1/2;
					nxG.attributes.uv.array[ 1 ] = 1/2;
					nxG.attributes.uv.array[ 2 ] = 1;
					nxG.attributes.uv.array[ 3 ] = 1/2;
					nxG.attributes.uv.array[ 4 ] = 1/2;
					nxG.attributes.uv.array[ 5 ] = 0;
					nxG.attributes.uv.array[ 6 ] = 1;
					nxG.attributes.uv.array[ 7 ] = 0;

					nxG.rotateY( - Math.PI / 2 );
					nxG.translate( - .5, 0, 0 );
					GEO.merge(new THREE.Geometry().fromBufferGeometry(nxG));
				}

				//POSITIVE Z-AXIS FACE


				if(pz === 0){
					pzG = new THREE.PlaneBufferGeometry( 1, 1 );

					pzG.attributes.uv.array[ 0 ] = 0;
					pzG.attributes.uv.array[ 1 ] = 1/2;
					pzG.attributes.uv.array[ 2 ] = 1/2;
					pzG.attributes.uv.array[ 3 ] = 1/2;
					pzG.attributes.uv.array[ 4 ] = 0;
					pzG.attributes.uv.array[ 5 ] = 0;
					pzG.attributes.uv.array[ 6 ] = 1/2;
					pzG.attributes.uv.array[ 7 ] = 0;

					pzG.translate( 0, 0, .5 );
					GEO.merge(new THREE.Geometry().fromBufferGeometry(pzG));

				}

				var geometry = new THREE.BufferGeometry().fromGeometry( GEO );
				geometry.computeBoundingSphere();

				var texture = new THREE.TextureLoader(loading).load( Tiles[tileNumber].Texture );
				texture.magFilter = THREE.NearestFilter;
				texture.minFilter = THREE.NearestMipMapLinearFilter;

				var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {map: texture, transparent:true, fog:true}) );
				mesh.position.x = pos.x;
				mesh.position.z = pos.z;
				mesh.position.y = pos.y;
				if(Tiles[tileNumber].Obstacle && Tiles[tileNumber].Static) {
					mesh.type = 'static';
					map.Obstacles[x] = mesh;
				}
				scene.add( mesh );



			}
		}

	});
}