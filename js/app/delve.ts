declare var $;
declare var Utils;
declare var Player;
//declare var decodeURIComponent;


class Delve {
	private _rooms: any;
	private _activeRoom: string;
	private _player: any;
	private _version:string =  '0.0.1';

	// Temp
	private _d: any = ['north'];

	// Private Methods
	private getRoomByIndex(id: number) {
		return this._rooms[id];
	}

	private getRoomById(id: string) {
		for(var i = 0; i < this._rooms.length; i++) {
			if(this._rooms[i].short_code === id) { return this._rooms[i]; }
		}
		return null;
	}

	private throwError(msg) {
		throw('>>> Error');		
	}

	// Public Methods
	public getRoomCount() {
		return this._rooms.length;
	}

	public getRoom() {
		var polar = {
			'north':'south',
			'south': 'north',
			'east':'west',
			'west':'east'
		};
		var d = this._d[Math.floor(Math.random()*this._d.length)];
		/*
		- shuffle rooms
		- loop through arry
		- compare room exits with the (opposite) direction of travel
		- match: return room
		- no match: Error.
		 */
		
		console.log('dir: ', d);
		console.log('dir (o): ', polar[d]);
		var rms = Utils.shuffle(this._rooms);
		for (var i = 0; i < rms.length; i++) {
			var rm = this._rooms[i];
			for (var x = 0; x < rm.exits.length; x++ ) {
				console.log('exit: ', rm.exits[x]);
				if(rm.exits[x] === polar[d]) {
					this._d = rm.exits;
					return this._rooms.splice(i,1)[0];
					// return rm;
				}
			}
		}
		this.throwError('Failed to find room');
	}
	public getRoom2() {
		var n = Math.round(Math.random() * (this._rooms.length - 1));
		var polar = {
			'north':'south',
			'south': 'north',
			'east':'west',
			'west':'east'
		};
		var d = 'north';//this._player.getDirection();
		var newRm = this._rooms[n];
		console.log('new room: ', newRm);
		console.log('dir: ', polar[d]);
		console.log('idx: ', n);
		console.log('len: ', this._rooms.length);
		var validExit = false;
		for(var i = 0; i < newRm.exits.length; i++) {
			if(newRm.exits[i] === polar[d]) {
				return newRm;
			}
		}
		this.getRoom();

	}
	private renderRoom(rm) {
		var d = 'north';
		$('#display header').html(rm.name);
		$('#display article').html(rm.desc);

		for (var x = 0; x < rm.exits.length; x++ ) {
			$('[data-dir="' + rm.exits[x] + '"]').toggleClass('disabled');
		}
		console.log('north: ', $('[data-dir="' + d + '"]'));
	}

	private getStart() {
		// for(var i = 0; i < this._rooms.length; i++) {
			for(var i in this._rooms) {
			if(this._rooms[i].start) {
				this._activeRoom = this._rooms[i].short_code;
				this.renderRoom(this._rooms[i])
				//this._rooms.splice(i, 1);
				delete this._rooms[i];
			}
		}
		console.log('rooms: ', this._rooms);
	}

	private registerEvents() {
		$('#nav button').on('click', function(evt) {
			console.log('dir: ', $(this).data('dir'));
		});
	}

	constructor() {
		//this._player = new Player();
		//this._player.dumpStats();
		// $.getJSON("rooms.json", function(json) {
		//     console.log(json); // this will show the info it in firebug console
		// });
		// temp
		var data1 = '{"rooms":{"hallway":{"name":"Hallway","short_code":"hallway","desc":"Standard+hallway.","exits":["north","south","east"],"hasMonster":false,"hasTreasure":false,"start":false},"foyer":{"name":"Foyer","short_code":"foyer","desc":"This+is+where+it+starts.","exits":["north","east","west"],"hasMonster":false,"hasTreasure":false,"start":true},"study":{"name":"Study","short_code":"study","desc":"No+Ms.+Scarlet!","exits":["south","east"],"hasMonster":true,"hasTreasure":true,"start":false},"library":{"name":"Library","short_code":"library","desc":"Books+galore%2C+no+candlesticks.","exits":["south","east","west"],"hasMonster":false,"hasTreasure":true,"start":false},"office":{"name":"Office","short_code":"office","desc":"Taking+care+of+business.","exits":["north","east"],"hasMonster":true,"hasTreasure":false,"start":false}}}';
		data1 = decodeURIComponent(data1);
		var data = JSON.parse(data1);
		console.log('data: ', data);
		this._rooms = data.rooms;

		this.registerEvents();

		this.getStart();
		console.log('active: ', this._activeRoom);

	}
}