declare var $;
declare var Utils;

class Editor {

	private _rooms:any;
	private _form: HTMLElement;

	private _onFileChange = (e) => { this.onFileChange(e); }
	private _createRoom = (e) => { this.onCreateRoom(e); }
	private _saveRooms = (e) => { this.saveRoomsFile(); }

	private handleExistingRooms(data: any) {
		data = decodeURIComponent(data);
		$('#selector').hide();
		// $('#roomList').show();
		// $('#editor').show();

		this._rooms = JSON.parse(data).rooms;
		this.listRooms();
	}

	private listRooms() {
		$('#roomList div').html('');
		for (var i = this._rooms.length - 1; i >= 0; i--) {
		    $('#roomList div').append($('<li />').attr('id',i).text(this._rooms[i].name))
		}
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
				that.handleExistingRooms(contents);	
			}
			reader.readAsText(f);
		}
	}


	private onCreateRoom(e: any) {
    	e.preventDefault();
    	var required = ['name', 'desc'];
    	var str = $('#roomMaker').serialize();
    	// clea form?
    	Utils.resetForm($('#roomMaker'));
    	var t:any = this.queryToObj(str);
    	// console.log('t: ', t);
    	var r:any = {};
    	// Check for empty required fields.
    	for (var x = 0; x < required.length; x++) {
    		if (t[required[x]].length < 1) {  
    			this.alert('Missing Required field');
	    		// return;
    		}
    	}

    	r.name = t.name;
    	r.short_code = t.name.replace(/\W/g,'_').toLowerCase();
    	r.desc = t.desc;
    	//r.short_code = r.name.toLowerCase()://replace(/\+/g,' ');
    	r.exits = [];

    	var exits = $("input[name='exits[]']:checked");
    	for( var e:any = 0; e < exits.length; e++) {
    		r.exits.push(exits[e].value);
    	}

    	if(r.exits.length === 0) {
    		this.alert('Rooms required exits');
    	}

    	// Set Defaults
    	r.hasMonster = (t.hasMonster === "on");
    	r.hasTreasure =(t.hasTreasure === "on");

    	r.start = (t.start === "on");
    	if(r.start) {
    		for (var i = 0; i < this._rooms.length; i++) {
    			this._rooms[i].start = false;
    		}
    	}

    	this._rooms.push(r);

    	console.log('rooms: ', this._rooms);
    	this.listRooms();

    	// var o = JSON.stringify({ "rooms" : this._rooms });
    	// var b = new Blob([o],{type : 'text/json'});
    	// saveAs(b, "rooms.json");
	}

	private saveRoomsFile() {
    	var o = JSON.stringify({ "rooms" : this._rooms });
    	var b = new Blob([o],{type : 'text/json'});
    	saveAs(b, "rooms.json");
	}
	private alert(msg) {
		console.log(msg);
		$( "#results" ).append( $('<span />').html(msg) );

	}

	private registerEvents() {
		console.log('registering events');
		$('#files').on('change', this._onFileChange);
		$('#roomMaker #create').on('click',this._createRoom);
		$('#save').on('click',this._saveRooms);
	}

	public constructor() {
		this._form = document.getElementById('roomMaker');
		this._rooms = [];
		this.registerEvents();
	}
}