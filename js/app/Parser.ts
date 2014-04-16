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
		var str = this.cantDo.go[0].replace(/{%s}/g, args.join(' '));
		this.updateConsole(str);
	}
	private declareNoJoy() {
		this.nojoy = Utils.shuffle(this.nojoy);
		this.updateConsole(this.nojoy[0]);
	}

	private updateConsole(msg) {
		$(this._console).append('<br /><span>' + msg + '</span>');
		$(this._console)[0].scrollTop = $(this._console)[0].scrollHeight;
		// $('#feedback span').each(function() {
		// 	console.log('this: ', $(this));
		// });
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
			$event.emit('toggle' + toggle, args);
		}
	}

	private handleGoCommand(args, cmd) {	
		var validDirections = ['north', 'south','east','west', 'up', 'down'];
		if(!args.length) { this.updateConsole('Where would you like to go?') ; return; }
		var dot = args[0];
		if(validDirections.indexOf(dot) === -1) {
			this.declareCantDo(cmd,dot);
		} else {
			console.log('going: ', dot);
			$event.emit('gotoRoom',dot);
		}

	}
	public execute(val) {
		$event.emit('log', 'parsing command');
		this._commandBuffer.push(val);
		var args = val.split(' ');
		var cmd = args.shift().toLowerCase();
		switch(cmd) {
			case 'go' :
				this.handleGoCommand(args, cmd);
				break;
			case 'help' :
				$event.emit('displayHelp');
				break;
			case 'dump' :
				console.log('####################');
				console.log('Command Buffer:');
				console.log(this._commandBuffer);
				console.log('####################');
				$event.emit('dump');
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
		this._console = $('#feedback');
	}
}