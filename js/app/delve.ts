declare var $;
declare var rooms;

module $delve {
	export function getroom(){
		var rm = rooms.pop();
		return rm;
	}
}
// $delve = (function($) {

// 	$.getRoom = function() {
// 		var rm = rooms.pop();
// 		return rm;
// 	}

// 	return $;

// })($delve || {})