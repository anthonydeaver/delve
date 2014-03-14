declare var $;

class Editor {

	private _onFileChange = (e) => { this.onFileChange(e); }
	private _submitRoomConfig = (e) => { this.onSubmitRoomConfig(e); }

	private parseRooms(data: any) {
		data = decodeURIComponent(data);
		$('#selector').hide();

		var rooms = JSON.parse(data).rooms;
		// for (var i = 0, var max = rooms.length; i < max; i++;){
		for (var i = rooms.length - 1; i >= 0; i--) {
		    $('#roomList div').append($('<li />').attr('id',i).text(rooms[i].name))
		}
		$( "#results" ).text( data );
	}

	private queryToObj(str) {
		var arr = str.split('&'),
			len = arr.length,
			obj = {}, 
			val = [],
			i;

		for(i= 0; i < len; i++) {
			val = arr[i].split('=');
			obj[val[0]] = val[1];
		}

		return obj;
	}

	private registerEvents() {
		$('files').on('change', this._onFileChange);
		$('#roomMaker').on('submit', this._submitRoomConfig);
	}

	// Event Handlers
	private onFileChange(evt: any) {
		console.log('selected');
		var files = evt.target.files;
		var contents;
		for (var i = 0, f; f = files[i]; i++) {
			var reader = new FileReader();
			reader.onload = function(e) {
				contents = e.target.result;
			}
			reader.onloadend = function() {
				this.parseRooms(contents);	
			}
			reader.readAsText(f);
		}
	}

	private onSubmitRoomConfig(e: any) {
    	e.preventDefault();
    	// e.stopPropagation();
    	// console.log('e: ', e);
    	var str = $( this ).serialize();
    	var t = this.queryToObj(str);
    	t.id = t.name.replace(/\W/g,'_');
    	t.name = t.name.replace(/\+/g,' ')
    	var rooms =  { "rooms" : [t] };

    	var o = JSON.stringify(rooms);
    	var b = new Blob([o],{type : 'text/json'});
    	saveAs(b, "rooms.json");
	}

	public init() {
		this.registerEvents();
	}
}