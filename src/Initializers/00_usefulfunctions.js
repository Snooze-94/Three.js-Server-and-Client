/**
 * Created by aamaya on 24-Aug-17.
 */
module.exports = getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = removeByAttr = function(arr, attr, value){
	var i = arr.length;
	while(i--){
		if( arr[i]
			&& arr[i].hasOwnProperty(attr)
			&& (arguments.length > 2 && arr[i][attr] === value ) ){

			arr.splice(i,1);

		}
	}
	return arr;
};