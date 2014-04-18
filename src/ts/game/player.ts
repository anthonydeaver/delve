declare var $event;

class Player {
	// Stats
	private _hp: number = 0;
	private _gold: number = 0;
	private _skills: any = [];
	private _treasure: any = [];

	private _currentRoom;

	// Movement
	private _direction: string;

	private _onDumpStats = (e) => this.dumpStats();

	public getDirection() {
		return this._direction;
	}
	public dumpStats() {
		console.log('>>>>>>>');
		console.log('Player stats:');
		console.log('HP      : ', this._hp);
		console.log('GOLD    : ', this._gold);
		console.log('SKILLS  : ', this._skills);
		console.log('TREASURE: ', this._treasure);
		console.log('>>>>>>>');
	}

	private registerEvents() {
		$event.bind('dump', this._onDumpStats);
	}

	public move(d: string) {
		this._direction = d;
	}


	constructor() {
		this._hp = 20;
		this._gold = 5;
		this._skills = [];
		this._treasure = [];

		this.registerEvents();
	}
}