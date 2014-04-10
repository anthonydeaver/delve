/// <reference path="Utils.ts" />
/// <reference path="delve.ts" />

declare var $;

class Parser {
	private _console;
	private _engine: Engine;
	private _commands: any = ['go','look','examine','take','use', 'help'];
	private nojoy = [
		"I have no idea what your are asking.",
		"What'chu talking 'bout Willis?",
		"What we have here is, a failure to communicate.",
		"The cake is a lie. "
	];

	private cantDo = {
		'go' : [
			"You can't go in that direction",
			"That's impossible.",
			"{%s} isn't open.",
			"Try again, you can't go that way.",
			"Seriously, you have a map..."
		],
		'look': [
			'Nothing special about the {%s}.'
		]
	};

	// Private methods
	declareCantDo(cmd, args) {
		this.cantDo[cmd] = Utils.shuffle(this.cantDo[cmd]);
		var str = this.cantDo.go[0].replace(/{%s}/g, args);
		var txt = $(this._console).val();
		txt += '\r' + str;
		$(this._console).val(txt);
	}
	declareNoJoy() {
		this.nojoy = Utils.shuffle(this.nojoy);
		var txt = $(this._console).val();
		txt += '\r' + this.nojoy[0];
		$(this._console).val(txt);
	}

	displayHelp() {
	}

	processGo(args, cmd) {	
		var validDirections = ['north', 'south','east','west'];
		var dot = args[0];
		if(validDirections.indexOf(dot) === -1) {
			//this.declareNoGo(dot);
			this.declareCantDo(cmd,dot);
		} else {
			this._engine.getRoomManager().go(dot);
		}

	}
	public execute(val) {
		var args = val.split(' ');
		args.shift(); // removes the > character
		var cmd = args.shift().toLowerCase();
		console.log('cmd: ', cmd);
		if(this._commands.indexOf(cmd) === -1) {
			this.declareNoJoy();
			return;
		}
		switch(cmd) {
			case 'go' :
				this.processGo(args, cmd);
				break;
			case 'help' :
				this.displayHelp();
				break;
		}

	}

	constructor(engine) {
		this._engine = engine;
		this._console = $('#console');
	}
}