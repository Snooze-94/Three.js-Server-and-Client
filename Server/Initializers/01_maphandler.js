/**
 * Created by aamaya on 24-Aug-17.
 */

module.exports = maphandler = {

	isFree: function (roomName, x, z) {
		var free = true;
		for(var layer in maps[roomName].layers){
			if(maps[roomName].layers.hasOwnProperty(layer)){
				if(maps[roomName].layers[layer][maphandler.getTile(roomName, x, z)] !== 0) free = false;
			}
		}
		return free;
	},

	getTile: function(roomName, x , z){
		return (z * maps[roomName].width) + x;
	},

	freeBetween: function(roomName, minX, maxX, minZ, maxZ){
		var found = false;
		while (!found){
			var searchX = getRandomInt(minX,maxX);
			var searchZ = getRandomInt(minZ,maxZ);
			if(maphandler.isFree(roomName, searchX, searchZ)){
				found = true;
				return {
					'x':searchX,
					'z':searchZ
				}
			}
		}
	}

};