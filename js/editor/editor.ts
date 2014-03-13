declare var $;

class Editor {

	constructor() {
		
	}
	
	parseRooms(data: string) {
		data = decodeURIComponent(data);
		$('#selector').hide();

		var rooms = JSON.parse(data).rooms;
		// for (var i = 0, var max = rooms.length; i < max; i++;){
		for (var i = rooms.length - 1; i >= 0; i--) {
		    $('#roomList div').append($('<li />').attr('id',i).text(rooms[i].name))
		}
		$( "#results" ).text( data );
	}
}