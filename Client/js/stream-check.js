/**
 * @property {method} $
 * @param {{ajax:function}} $
 */
$.ajax({
	type: 'GET',
	url: 'https://api.twitch.tv/kraken/streams/mrdrifzzts',
	headers: {
		'Client-ID': 'hhxxp59h6u8cqsq2kuzb4r0mtz838g'
	},
	success: function(data) {
		/**
		 * @param {{stream:object}} data
		 */
		if (data.stream === null) {
			console.log('offline');
		} else {
			console.log('online');
		}
	}
});