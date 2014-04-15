/// <reference path="Utils.ts" />
/// <reference path="delve.ts" />

declare var $;
declare var $event;

class Parser {
	private _console;
	private _commandBuffer = [];
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
	private declareCantDo(cmd, args) {
		this.cantDo[cmd] = Utils.shuffle(this.cantDo[cmd]);
		var str = this.cantDo.go[0].replace(/{%s}/g, args);
		var txt = $(this._console).val();
		txt += '\r' + str;
		$(this._console).val(txt);
	}
	private declareNoJoy() {
		this.nojoy = Utils.shuffle(this.nojoy);
		//var txt = $(this._console).val();
		// txt += '\r' + this.nojoy[0];
		// var txt = '>>> ' + this.nojoy[0];
		// $(this._console).html(txt);
		$event.triggerEvent('error',this.nojoy[0]);
//		this._engine.throwError(this.nojoy[0]);
	}

	private handleShowCommand(args: any) {
	}


	private handleToggleCommand(args: any[]) {
		var objects = ['map', 'controls', 'help'];
		var toggle = args[0];
		console.log('toggle: ', toggle);
		if(objects.indexOf(toggle) === -1) {
			this.declareNoJoy();
		} else {
			$event.triggerEvent('toggle' + toggle, args);
		}
	}

	private handleGoCommand(args, cmd) {	
		var validDirections = ['north', 'south','east','west'];
		var dot = args[0];
		if(validDirections.indexOf(dot) === -1) {
			this.declareCantDo(cmd,dot);
		} else {
			$event.triggerEvent('gotoRoom',dot);
		}

	}
	public execute(val) {
		$event.triggerEvent('log', 'parsing command');
		var args = val.split(' ');
		args.shift(); // removes the > character
		this._commandBuffer.push(args.join(' '));
		var cmd = args.shift().toLowerCase();
		//console.log('cmd: ', cmd);
		// if(this._commands.indexOf(cmd) === -1) {
		// 	this.declareNoJoy();
		// 	return;
		// }
		switch(cmd) {
			case 'go' :
				this.handleGoCommand(args, cmd);
				break;
			case 'help' :
				$event.triggerEvent('displayHelp');
				break;
			case 'dump' :
				console.log('####################');
				console.log('Command Buffer:');
				console.log(this._commandBuffer);
				console.log('####################');
				$event.triggerEvent('dump');
				break;
			case 'show':
				this.handleShowCommand(args);
				break;
			case 'toggle':
				this.handleToggleCommand(args);
				break;
			default:
				this.declareNoJoy();
				break;
		}

	}

	constructor(engine) {
		this._engine = engine;
		this._console = $('#console');
	}
}