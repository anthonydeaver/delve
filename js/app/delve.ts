/// <reference path="Rooms.ts" />
/// <reference path="player.ts" />
/// <reference path="Parser.ts" />
/// <reference path="Utils.ts" />
/// <reference path="Modal.ts" />
/// <reference path="DelveMap.ts" />
declare var $;


class Engine {
	private _mappings: any = {
		'0001': 'haunted_mansion'
	};
	private _rooms: any;
	private _activeRoom: string;
	private _player: Player;
	private _parser: Parser;
	private _map: DelveMap;
	private _modal: Modal;
	private _roomManager: Rooms;
	private _version:string =  '0.0.1';

	// Private Methods
	private registerEvents():void {
		var that = this;
		$('#command').on('keypress', function(e) {
			if(e.which === 13) {
				var val = $(this).val();
				$(this).val('> ');
				that._parser.execute(val);
			}
		});
		$('#command').on('focus', function() {
			$(this).val('> ');
		});

	}

	// Public Methods
	public throwError(msg):void {
		throw('>>> Error: ', msg);		
	}

	public getRoomManager() {
		return this._roomManager;
	}

	public getFile(filename) {

	}

	public displayHelp() {

	}

	constructor(o) {
		var t = this._mappings[o.world || '0001'];
		this._player = new Player();
		// this._modal = new Modal();
		this._roomManager = new Rooms(this, t);
		this._map = new DelveMap();
		this._parser = new Parser(this);
		this._player.dumpStats();

		this.registerEvents();

		new Modal({title: 'Welcome to Delve!', msg: 'Welcome, be with you shortly...'});
	}
}