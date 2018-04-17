/**
 * Created by Alex on 23/8/2017.
 */
module.exports = function (client, data) {
	switch (data.event.toUpperCase()){
		case 'DIR':
			client.dir = data.dir;
			client.broadcastRoom('dir', {
				'username':client.name,
				'dir':client.dir
			});
			break;
		case 'GEO':
			client.isGeoDefined = true;
			client.ip = data.ip;
			client.geo = {
				'country': data.country_name,
				'region': data.region
			};
			break;
		case 'MOVE':
			client.x = data.x;
			client.z = data.z;
			client.broadcastRoom('MOVE',{
				'username':client.name,
				'x':client.x,
				'z':client.z
			});
			break;
		default:
			console.log('NO SERVER LOGIC IMPLEMENTED FOR PACKET OF EVENT: "' + data.event + '"');
			break;
	}
};