/// <reference path="Utils.ts" />
/// <reference path="delve.ts" />

declare var $;
declare var $event;

class Parser {
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
			"'{%s}'' isn't a valid exit.",
			"Try again, you can't go that way.",
			"Seriously, you have a map..."
		],
		'look': [
			'Nothing special about the {%s}.'
		]
	};

	private _onDataDump = () => { this.onDataDump(); }

	// Private methods
	private declareCantDo(cmd, args) {
		var arr = Utils.shuffle(this.cantDo[cmd]);
		var str = arr[0].replace(/{%s}/g, args);
		this.updateConsole(str);
	}
	private declareNoJoy() {
		this.nojoy = Utils.shuffle(this.nojoy);
		this.updateConsole(this.nojoy[0]);
	}

	private updateConsole(msg) {
		var _console = $('#feedback');
		$(_console).append('<br /><span>' + msg + '</span>');
		$(_console)[0].scrollTop = $(_console)[0].scrollHeight;
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

	private onDataDump() {
		console.log('####################');
		console.log('Command Buffer:');
		console.log(this._commandBuffer);
		console.log('####################');
	}

	private registerEvents() {
		$event.bind('nojoy', this.updateConsole);
		$event.bind('dump', this._onDataDump);
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
		this.registerEvents();
	}
}