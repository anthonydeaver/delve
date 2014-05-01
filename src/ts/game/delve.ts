/// <reference path="Rooms.ts" />
/// <reference path="player.ts" />
/// <reference path="Parser.ts" />
/// <reference path="Utils.ts" />
/// <reference path="Modal.ts" />
/// <reference path="DelveMap.ts" />
declare var $;
declare var $event;

class DelveEngine {
	private _mappings: any = {
		'0001': 'haunted_mansion'
	};
	private _rooms: any;
	private _world: string;
	private _activeRoom: string;
	private _player: Player;
	private _parser: Parser;
	private _modal: Modal;
	private _roomManager: Rooms;
	private _version:string =  '0.0.1';

	private _onShowHelp = (e) => this.onShowHelp(e);
	private _log = (m) => this.onLog(m);

	// Private Methods
	private registerEvents():void {
		var that = this;
		$event.bind('error', this.throwError);
		$event.bind('log', this._log);
		$event.bind('displayHelp', this._onShowHelp);
		$('#command input').on('keypress', function(e) {
			if(e.which === 13) {
				var val = $(this).val();
				$(this).val('');
				that._parser.execute(val);
			}
		});
		$('#command input').on('focus', function() {
			$(this).val('');
		});

		
		$('#temp').on('click', this._onShowHelp);
		$('#nav header').on('click', function() {
			var $nav = $(this).parent();
			$nav.animate({
				right: parseInt($nav.css('right'), 10) === 0 ? -325 : 0
			})
		});
	}
	private onLog(msg) {
		console.log('msg:: ', msg);
		var val = $('feedback').val();
		console.log('val: ', val);
		val = val + '\r' + msg;
		// $('#feedback').val(val);
		// $('#feedback').scrollTop($('#feedback')[0].scrollHeight);
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
		var txt = '>>> ' + msg;
		//$('#console').html(txt);
		throw('>>> Error: ', msg);		
	}

	public getRoomManager() {
		return this._roomManager;
	}

	public getFile(filename) {

	}

	private setupUI() {
		$('body').css('background','url(/environs/' + this._world + '/assets/background.jpg) no-repeat');
		$('body').css('background-size','cover');

	}

	constructor(o) {
		this._world = this._mappings[o.world || '0001'];
		new Player();
		this._parser = new Parser(this);
		new Rooms(this._world);

		this.registerEvents();

		this.setupUI();
	}
}