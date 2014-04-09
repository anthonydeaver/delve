/// <reference path="Rooms.ts" />
/// <reference path="player.ts" />
/// <reference path="Utils.ts" />
/// <reference path="DelveMap.ts" />
declare var $;


class Engine {
	private _mappings: any = {
		'0001': 'haunted_mansion'
	};
	private _rooms: any;
	private _activeRoom: string;
	private _player: Player;
	private _map: DelveMap;
	private _roomManager: Rooms;
	private _version:string =  '0.0.1';

	// Private Methods
	private registerEvents():void {
	}

	// Public Methods
	public throwError(msg):void {
		throw('>>> Error: ', msg);		
	}

	public getFile(filename) {

	}

	constructor(o) {
		this._player = new Player();
		this._roomManager = new Rooms(this, o.world);
		this._map = new DelveMap();
		this._player.dumpStats();

		this.registerEvents();
	}
}