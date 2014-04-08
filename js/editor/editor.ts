declare var $;

class Editor {

	private _rooms:any;
	private _form: HTMLElement;

	private _onFileChange = (e) => { this.onFileChange(e); }
	private _submitRoomConfig = (e) => { this.onSubmitRoomConfig(e); }

	private parseRooms(data: any) {
		data = decodeURIComponent(data);
		$('#selector').hide();
		$('#roomList').show();
		$('#editor').show();

		this._rooms = JSON.parse(data).rooms;
		console.log('rooms: ', this._rooms);
		for (var i = this._rooms.length - 1; i >= 0; i--) {
		    $('#roomList div').append($('<li />').attr('id',i).text(this._rooms[i].name))
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

	// Event Handlers
	private onFileChange(evt: any) {
		console.log('selected');
		var that = this;
		var files = evt.target.files;
		var contents;
		console.log('parsing...');
		for (var i = 0, f; f = files[i]; i++) {
			var reader = new FileReader();
			reader.onload = function(e) {
				contents = e.target.result;
			}
			reader.onloadend = function() {
				that.parseRooms(contents);	
			}
			reader.readAsText(f);
		}
	}

	private onSubmitRoomConfig(e: any) {
		console.log('submitting room');
    	e.preventDefault();
    	// e.stopPropagation();
    	var str = $('#roomMaker').serialize();
    	var t = this.queryToObj(str);
    	console.log('this: ', this);
    	t.name = t.name.replace(/\W/g,'_');
    	t['name'] = t['name'].replace(/\+/g,' ')

    	// Set Defaults
    	t['hasMonster'] = t['hasMonster'] || false;
    	t['hasTreasure'] = t['hasTreasure'] || false;

    	this._rooms.push(t);

    	var o = JSON.stringify({ "rooms" : this._rooms });
    	var b = new Blob([o],{type : 'text/json'});
    	saveAs(b, "rooms.json");
	}

	private registerEvents() {
		console.log('registering events');
		$('#files').on('change', this._onFileChange);
		$('#roomMaker #save').on('click',this._submitRoomConfig);
	}

	public constructor() {
		this._form = document.getElementById('roomMaker');
		this._rooms = [];
		this.registerEvents();
	}
}