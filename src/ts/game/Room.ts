declare var $;
class Room {
	private _name: string;
	private _id: string;
	private _desc: string;
	private _exits: any = [];
	private _links: any = {};
	private _hasMonster: boolean;
	private _hasItem: boolean;
	private _start: boolean = false;
    private _position = {};

	get name() {
		return this._name;
	}

	get id() {
		return this._id;
	}

    get position() {
        return this._position;
    }

    set position(o) {
        this._position = o;
    } 

    get exits() {
        return this._exits;
    }

    get links() {
        return this._links;
    }

    get start() {
        return this._start;
    }

    hasExit(exit) {
        for ( var i = 0; i < this._exits.length; i++) {
            if(this._exits[i] === exit) { return true; }
        }
        return false;
    }
	
    render() {
        $('#map span[type="room"]').removeClass('current');
        $('#exits ul').html('');
        $('[data-dir]').each(function(){
            $(this).removeClass();
            $(this).addClass('disabled');
        });
        $('#display header').html(this._name);
        $('#display #desc').html(this._desc);

        for (var x = 0; x < this._exits.length; x++ ) {
            var name = this._exits[x];
            if(this._links[name]) {
                name += " <span>(" + this._links[name].name + ")</span>";
            }
            $('#exits ul').append($('<li />').html(name));
        }

        $('#map span[type="room"]#' + this._id).addClass('current');
    }

    rotateExits(rm) {
        for (var i = 0; i < this._exits.length; i++ ) {
            switch(this._exits[i]) {
                case 'north':
                    this._exits[i] = 'east';
                    break;
                case 'east':
                    this._exits[i] = 'south';
                    break;
                case 'south':
                    this._exits[i] = 'west';
                    break;
                case 'west':
                    this._exits[i] = 'north';
                    break;
            }
        }
    }

    constructor(config) {
    	this._name 			= config.name;
    	this._id 			= config.id;
    	this._desc 			= config.desc;
    	this._exits			= config.exits;
    	this._links 		= config.links;
    	this._hasMonster 	= config.hasMonster;
    	this._hasItem 		= config.hasItem;
    	this._start 		= config.start;
    }
}