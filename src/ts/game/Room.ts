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

	get name() {
		return this._name;
	}

	get id() {
		return this._id;
	}

    public hasExit(exit) {
        for ( var i = 0; i < this._exits.length; i++) {
            if(this._exits[i] === exit) { return true;}
        }
        return false;
    }
	
    public render(rm) {
        $('#map span[type="room"]').removeClass('current');
        $('#exits ul').html('');
        $('[data-dir]').each(function(){
            $(this).removeClass();
            $(this).addClass('disabled');
        });
        $('#display header').html(this._name);
        $('#display #desc').html(this._desc);

        for (var x = 0; x < this._exits.length; x++ ) {
            // $('[data-dir="' + this._exits[x] + '"]').removeClass('disabled');
            var name = this._exits[x];
            if(this._links[name]) {
                name += " <span>(" + this._links[name].name + ")</span>";
            }
            $('#exits ul').append($('<li />').html(name));
        }

        console.log('id: ', this._id);
        $('#map span[type="room"]#' + this._id).addClass('current');
    }

    public rotateExits(rm) {
        console.log('rotating');
        for (var i = 0; i < this._exits.length; i++ ) {
            console.log('loop: ', this._exits[i]);
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