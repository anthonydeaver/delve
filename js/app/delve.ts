/// <reference path="Rooms.ts" />
/// <reference path="player.ts" />
/// <reference path="Parser.ts" />
/// <reference path="Utils.ts" />
/// <reference path="Modal.ts" />
/// <reference path="DelveMap.ts" />
declare var $;
declare var $event;


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

	private _onShowHelp = (e) => this.onShowHelp(e);

	// Private Methods
	private registerEvents():void {
		var that = this;
		$event.bind('displayHelp', this._onShowHelp);
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

		// temp
		$('#temp').on('click', this._onShowHelp);
	}

	private onShowHelp(e: any) {
		console.log('showing help');
		new Modal({title: 'Delve Help', msg: "" 
			+ "It's simple really, you just enter commands into the command bar (the black bar at the bottom of the screen) and things happen."
			+ "Currently there are # supported commands:<br />"
			+ "<ul>"
			+	"<li><i>GO</i> {direction} - where direction is any of the exits listed for the current room (north, south, etc...)</li>"
			+ "<li><i>HELP</i> (obviously)</li>"
			+ "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>"
			+ "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>"
			+ "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>"
			+ "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>"
			+	"</ul>"
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
		this._roomManager = new Rooms(this, t);
		this._map = new DelveMap();
		this._parser = new Parser(this);
		this._player.dumpStats();

		this.registerEvents();

		// new Modal({title: 'Welcome to Delve!', msg: 'Welcome, be with you shortly...'});
	}
}