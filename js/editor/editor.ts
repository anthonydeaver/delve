declare var $;
declare var Utils;
declare var saveAs;

class Editor {

	private _rooms:any;
	private _form: HTMLElement;

	private _onFileChange = (e) => { this.onFileChange(e); }
	private _createRoom = (e) => { this.onSaveRoom(e); }
	private _updateRoom = (e) => { this.onUpdateRoom(e); }
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
		var that = this;
		$('#roomList div').html('');
		for(var i in this._rooms) {
			var rm = this._rooms[i];
			var li = $('<li />').attr('id',i).text(this._rooms[i].name);
			li.append($('<a />').attr('href','/').attr('id',this._rooms[i].id).html('[edit]'));
		    $('#roomList div').append(li);
		    $('#roomList a').on('click', function(e) {
		    	e.preventDefault();
		    	that.onEditRoom($(this).attr('id'));
		    });
		}
	}

	private onEditRoom(id: string) {
		var rm = this._rooms[id];
		for(var k in rm) {
			var f = $('#roomMaker [name="' + k + '"]');
			f.val(rm[k]);
			if(k == 'hasMonster' || k == 'hasTreasure' || k == 'start') {
				$('#roomMaker [name="' + k + '"]').prop('checked',rm[k]);
			}
		}
		$('#roomMaker #create').hide();
		$('#roomMaker #update').show();
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

	private onUpdateRoom(e: any) {
	}


	private onSaveRoom(e: any) {
    	e.preventDefault();
    	var required = ['name', 'desc'];
    	var str = $('#roomMaker').serialize();
    	var t:any = this.queryToObj(str);
    	console.log('t: ', t);
    	console.log('t: ', str);
    	var URID = t.name.replace(/\W/g,'_').toLowerCase();
    	var r:any = this._rooms[URID] || {};
    	var valid = true;

    	// Check for empty required fields.
    	for (var x = 0; x < required.length; x++) {
    		// console.log(required[x] + ": " + t[required[x]].length);
    		if (t[required[x]].length < 1) {  
    			this.alert('Missing Required field: ' + required[x]);
    			valid = false;
    		}
    	}
    	if (!valid)  return;

    	r.name = t.name.replace(/\+/g,' ');
    	r.id = URID;
    	r.desc = t.desc.replace(/\+/g,' ');
    	r.exits = [];
    	r.connections = {};
    	r.gridCoord = [];

    	var exits = $("input[name='exits']:checked");
    	for( var e:any = 0; e < exits.length; e++) {
    	console.log('exits: ', exits[e].value);
    		r.exits.push(exits[e].value);
    	}

    	if(r.exits.length === 0) {
    		this.alert('Rooms require exits');
    		return;
    	}

    	// Set Defaults
    	r.hasMonster = $('#roomMaker [name="hasMonster"]').is(':checked');;
    	r.hasTreasure = $('#roomMaker [name="hasTreasure"]').is(':checked');;
    	console.log('t.start: ', (t.start === "on"));
    	r.start = $('#roomMaker [name="start"]').is(':checked');;
    	if(r.start) {
    		for (var i = 0; i < this._rooms.length; i++) {
    			this._rooms[i].start = false;
    		}
    	}

    	this._rooms[r.id] = r;

    	Utils.resetForm($('#roomMaker'));
    	this.listRooms();
	}

	private saveRoomsFile() {
    	var o = JSON.stringify({ "rooms" : this._rooms });
    	var b = new Blob([o],{type : 'text/json'});
    	saveAs(b, "rooms.json");
    	this.tell('Rooms saved');
	}
	private alert(msg) {
		var alt = $('<div />').addClass('alert').html(msg);
		$('#console').append(alt);
		$('.alert').fadeOut( 5000 );	
	}
	private tell(msg) {
		var alt = $('<div />').addClass('notice').html(msg);
		$('#console').append(alt);
		$('.notice').fadeOut( 5000 );	
	}

	private registerEvents() {
		console.log('registering events');
		$('#files').on('change', this._onFileChange);
		$('#roomMaker #save').on('click',this._createRoom);
		$('#roomMaker #clear').on('click', function(e) {
			e.preventDefault();
			Utils.resetForm($('#roomMaker'));
		});
		$('#export').on('click',this._saveRooms);
	}

	public constructor() {
		this._form = document.getElementById('roomMaker');
		this._rooms = {};
		this.registerEvents();
	}
}